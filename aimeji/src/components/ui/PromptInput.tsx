import { useState } from 'react';

interface PromptInputProps {
  onPromptChange: (prompt: string) => void;
  defaultPrompt?: string;
  className?: string;
}

export function PromptInput({ 
  onPromptChange, 
  defaultPrompt = '', 
  className = '' 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    onPromptChange(newPrompt);
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor="prompt"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Customize Your Ghibli Character (Optional)
      </label>
      <textarea
        id="prompt"
        name="prompt"
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        placeholder="Describe your character (e.g., 'young adventurer with short brown hair and a curious expression, wearing explorer clothes, standing in a meadow')"
        value={prompt}
        onChange={handleChange}
      />
      <p className="mt-1 text-xs text-gray-500">
        Leave blank for automatic styling, or describe specific features for more control.
      </p>
    </div>
  );
} 