import ThankYouContent from '../ThankYouContent';

export default function ThankYouContentExample() {
  return (
    <ThankYouContent 
      purchaseType="pattern_session" 
      onUpgrade={() => console.log('Upgrade clicked')}
    />
  );
}
