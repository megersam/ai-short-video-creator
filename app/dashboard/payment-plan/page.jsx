import React from 'react';

const pricingPlans = [
  {
    title: 'Premium Plan',
    description: 'Best choice for personal use and your next big project.',
    price: '$10',
    period: 'per month',
    features: [
      'Personalized configuration', 
      'Unlimited video creation',
      'Store up to 1GB of videos',
      '24/7 customer support',
    ],
  },
  {
    title: 'Basic Plan',
    description: 'Affordable option for personal use.',
    price: '$7',
    period: 'per month',
    features: [ 
      'Unlimited video creation',
      'No storage included',
      '24/7 customer support',
    ],
  },
];


const Pricing = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
  <div className="py-0 px-4 mx-auto max-w-screen-xl lg:py-4 lg:px-6 fixed"> {/* Reduced top padding */}
    <div className="mx-auto max-w-screen-md text-center mb-2 lg:mb-8"> {/* Reduced bottom margin */}
      <h2 className="text-4xl font-extrabold text-primary dark:text-white mb-1"> {/* Reduced bottom margin */}
        Our Pricing
      </h2>
    </div>
    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white transition-all duration-300 hover:border-primary" // Added hover:border-primary and transition effects
        >
          <h3 className="mb-4 text-2xl font-semibold">{plan?.title}</h3>
          <div className="flex justify-center items-baseline my-4">
            <span className="mr-2 text-5xl font-extrabold">{plan?.price}</span>
            <span className="text-gray-500 dark:text-gray-400">{plan?.period}</span>
          </div>
          <ul role="list" className="mb-8 space-y-4 text-left">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-primary-900"
          >
            Get Started
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

  


  );
};

export default Pricing;
