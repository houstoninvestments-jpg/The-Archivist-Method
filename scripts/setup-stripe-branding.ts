import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover" as any,
});

async function updateStripeBranding() {
  console.log("=== Stripe Branding & Product Setup ===\n");

  console.log("1. Updating product descriptions...\n");

  try {
    const products = await stripe.products.list({ limit: 100 });

    const quickStartProduct = products.data.find(
      (p) => p.id === "prod_quick_start" || p.name?.includes("Field Guide") || p.name?.includes("Quick")
    );

    const archiveProduct = products.data.find(
      (p) => p.id === "prod_complete_archive" || p.name?.includes("Complete Archive")
    );

    if (quickStartProduct) {
      await stripe.products.update(quickStartProduct.id, {
        name: "The Field Guide",
        description: "The Field Guide — Your complete interrupt protocol.",
      });
      console.log(`   Updated "${quickStartProduct.id}": The Field Guide — Your complete interrupt protocol.`);
    } else {
      console.log("   WARNING: Could not find Quick-Start / Field Guide product in Stripe.");
      console.log("   Available products:");
      products.data.forEach((p) => console.log(`     - ${p.id}: ${p.name}`));
    }

    if (archiveProduct) {
      await stripe.products.update(archiveProduct.id, {
        name: "The Complete Archive",
        description: "The Complete Archive — Every pattern. Every scenario. The complete system.",
      });
      console.log(`   Updated "${archiveProduct.id}": The Complete Archive — Every pattern. Every scenario. The complete system.`);
    } else {
      console.log("   WARNING: Could not find Complete Archive product in Stripe.");
    }
  } catch (err) {
    console.error("   Error updating products:", err);
  }

  console.log("\n2. Attempting to update account branding...\n");

  try {
    const account = await stripe.accounts.retrieve();
    console.log(`   Account: ${account.id}`);

    await stripe.accounts.update(account.id as string, {
      settings: {
        branding: {
          primary_color: "#00d4aa",
          secondary_color: "#0a0a0a",
        },
      },
      business_profile: {
        name: "The Archivist Method",
      },
    });
    console.log("   Branding colors set: primary=#00d4aa, secondary=#0a0a0a");
    console.log("   Business name set: The Archivist Method");
  } catch (err: any) {
    if (err.type === "StripeInvalidRequestError") {
      console.log("   Cannot update branding via API for this account type.");
      console.log("   This is expected for standard Stripe accounts.");
    } else {
      console.error("   Error:", err.message || err);
    }
  }

  console.log("\n=== Manual Steps Required ===");
  console.log("\nGo to Stripe Dashboard > Settings > Branding:");
  console.log("  1. Set Icon/Logo to The Archivist Method logo");
  console.log("  2. Set Brand color to #00d4aa (teal)");
  console.log("  3. Set Accent color to #00d4aa (teal)");
  console.log("  4. Background will follow your brand color settings");
  console.log("\nGo to Stripe Dashboard > Settings > Public details:");
  console.log('  1. Set Business name to "The Archivist Method"');
  console.log('  2. Set Statement descriptor to "ARCHIVIST METHOD"');
  console.log("\nDone.\n");
}

updateStripeBranding().catch(console.error);
