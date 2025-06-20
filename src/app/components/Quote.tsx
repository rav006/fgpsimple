// e:\\fgsimple\\src\\app\\components\\Quote.tsx
import React from "react";

interface QuoteProps {
  text: string;
  author: string;
}

const Quote: React.FC<QuoteProps> = ({ text, author }) => {
  return (
    <div className="my-8 p-6 border-l-4 border-gray-500 italic bg-gray-100 dark:bg-gray-800 dark:border-gray-400">
      <p className="text-xl text-gray-800 dark:text-gray-200">{`"${text}"`}</p>
      <p className="text-right mt-2 text-gray-600 dark:text-gray-400">
        - {author}
      </p>
    </div>
  );
};

export default Quote;
