import dividerImage from "@assets/generated_images/decorative_divider_element.png";

interface DividerProps {
  className?: string;
}

export default function Divider({ className = "" }: DividerProps) {
  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <img 
        src={dividerImage} 
        alt="" 
        className="h-8 sm:h-10 w-auto max-w-xs sm:max-w-md opacity-60"
        aria-hidden="true"
      />
    </div>
  );
}
