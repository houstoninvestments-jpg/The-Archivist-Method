import AccountTab from '../AccountTab';

export default function AccountTabExample() {
  return (
    <AccountTab 
      email="test@example.com"
      hasPatternSession={true}
      hasCompleteArchive={false}
      onUpgrade={() => console.log('Upgrade clicked')}
    />
  );
}
