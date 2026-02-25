const STORAGE_PREFIX = 'archivist_vault_';

function getStore(table: string): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + table);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStore(table: string, data: any[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(data));
  } catch {
    // silently degrade
  }
}

type Filter = { type: string; col: string; val: any };

class QueryBuilder {
  private table: string;
  private filters: Filter[] = [];
  private _orderCol: string | null = null;
  private _orderAsc = true;
  private _limitN: number | null = null;
  private _head = false;
  private _countMode = false;

  constructor(table: string) {
    this.table = table;
  }

  select(cols?: string, opts?: { count?: string; head?: boolean }) {
    if (opts?.head) this._head = true;
    if (opts?.count) this._countMode = true;
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ type: 'eq', col, val });
    return this;
  }

  gte(col: string, val: any) {
    this.filters.push({ type: 'gte', col, val });
    return this;
  }

  lt(col: string, val: any) {
    this.filters.push({ type: 'lt', col, val });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this._orderCol = col;
    this._orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(n: number) {
    this._limitN = n;
    return this;
  }

  single() {
    const result = this.execute();
    const rows = result.data;
    return Promise.resolve({
      data: rows && rows.length > 0 ? rows[0] : null,
      error: null,
      count: result.count,
    });
  }

  private execute() {
    let rows = getStore(this.table);

    for (const f of this.filters) {
      rows = rows.filter((r: any) => {
        if (f.type === 'eq') return r[f.col] === f.val;
        if (f.type === 'gte') return r[f.col] >= f.val;
        if (f.type === 'lt') return r[f.col] < f.val;
        return true;
      });
    }

    if (this._orderCol) {
      const col = this._orderCol;
      const asc = this._orderAsc;
      rows.sort((a: any, b: any) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });
    }

    const count = rows.length;

    if (this._limitN !== null) {
      rows = rows.slice(0, this._limitN);
    }

    if (this._head) {
      return { data: null, error: null, count };
    }

    return { data: rows, error: null, count };
  }

  then(
    resolve?: ((value: any) => any) | null,
    reject?: ((reason: any) => any) | null,
  ): Promise<any> {
    const result = this.execute();
    return Promise.resolve(result).then(resolve, reject);
  }

  catch(reject: (reason: any) => any): Promise<any> {
    return this.then(null, reject);
  }
}

class UpdateBuilder {
  private table: string;
  private updates: any;
  private filters: Array<{ col: string; val: any }> = [];

  constructor(table: string, updates: any) {
    this.table = table;
    this.updates = updates;
  }

  eq(col: string, val: any) {
    this.filters.push({ col, val });
    return this;
  }

  select() {
    return this;
  }

  single() {
    return this.then((r: any) => {
      const rows = getStore(this.table);
      const match = rows.find((r: any) =>
        this.filters.every(f => r[f.col] === f.val)
      );
      return { data: match ? { ...match, ...this.updates } : null, error: null };
    });
  }

  then(
    resolve?: ((value: any) => any) | null,
    reject?: ((reason: any) => any) | null,
  ): Promise<any> {
    const rows = getStore(this.table);
    const updated = rows.map((r: any) => {
      const match = this.filters.every(f => r[f.col] === f.val);
      return match ? { ...r, ...this.updates } : r;
    });
    setStore(this.table, updated);
    const result = { data: null, error: null };
    return Promise.resolve(result).then(resolve, reject);
  }

  catch(reject: (reason: any) => any): Promise<any> {
    return this.then(null, reject);
  }
}

class InsertBuilder {
  private table: string;
  private record: any;
  private newRow: any;

  constructor(table: string, record: any) {
    this.table = table;
    this.record = record;
    this.newRow = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...record,
    };
    const rows = getStore(table);
    rows.push(this.newRow);
    setStore(table, rows);
  }

  select() {
    return this;
  }

  single() {
    return Promise.resolve({ data: this.newRow, error: null });
  }

  then(
    resolve?: ((value: any) => any) | null,
    reject?: ((reason: any) => any) | null,
  ): Promise<any> {
    return Promise.resolve({ data: this.newRow, error: null }).then(resolve, reject);
  }

  catch(reject: (reason: any) => any): Promise<any> {
    return this.then(null, reject);
  }
}

export const supabase = {
  from(table: string) {
    return {
      select(cols?: string, opts?: { count?: string; head?: boolean }) {
        const qb = new QueryBuilder(table);
        return qb.select(cols, opts);
      },
      insert(record: any) {
        return new InsertBuilder(table, Array.isArray(record) ? record[0] : record);
      },
      update(updates: any) {
        return new UpdateBuilder(table, updates);
      },
      delete() {
        return new QueryBuilder(table);
      },
    };
  },
};
