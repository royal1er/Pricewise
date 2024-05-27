'use client' // S'assurer que le composant s'exécute côté client

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      return ['amazon.com', 'amazon.'].some(domain => parsedURL.hostname.includes(domain));
    } catch (error) {
      return false;
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidAmazonProductURL(searchPrompt)) {
      alert('Please provide a valid Amazon link');
      return;
    }

    setIsLoading(true);
    try {
      const product = await scrapeAndStoreProduct(searchPrompt);
      if (product && product._id) {
        router.push(`/products/${product._id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Entrer le lien du produit"
        className="searchbar-input"
      />
      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'En cours...' : 'Rechercher'}
      </button>
    </form>
  );
}

export default Searchbar;
