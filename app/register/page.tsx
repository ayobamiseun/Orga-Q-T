"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Page: React.FC = () => {
  const router = useRouter();
  const [ email, setEmail ] = useState<string>('');
  const [ error, setError ] = useState<string>('');
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  const url: string | undefined = process.env.NEXT_PUBLIC_REGISTER_API;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError("")
    event.preventDefault();
    setIsSubmitting(true);

    if (!url) {
      setIsSubmitting(false)
      setError('An error occur speak to admin');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {

        throw new Error('Failed to submit email');
      }

      const data = await response.json();
      // Save token to local storage
      toast.success('Account Created');
      router.push('/');
      console.log(data.token)
      localStorage.setItem('organUserToken', data.token);
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Error submitting email. Please try again.');
    }
    finally {
      // Set isSubmitting back to false after form submission
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto  flex flex-col justify-center h-screen">
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className={`text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
          } text-center font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && (
        <div className="text-red-600 mt-2">
          {error}
        </div>
      )}
    </form>
  );
}

export default Page;
