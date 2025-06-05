import React, { useState } from 'react';

const WeightShippings = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('Gram (g)');
  const [dimensions, setDimensions] = useState({ width: '', height: '', length: '' });
  const [insurance, setInsurance] = useState('optional');
  const [shippingService, setShippingService] = useState('standard');
  const [preOrder, setPreOrder] = useState(false);

  return (
    <div className="p-5 mt-8 relative border rounded-xl bg-white shadow-md">
      <h2 className="text-base font-medium border-b pb-5 flex items-center">
        <i className="mr-2 size-4">▼</i> Weight & Shipping
      </h2>

      {/* Product Weight */}
      <div className="mt-5 flex flex-col xl:flex-row gap-5">
        <div className="xl:w-64">
          <div className="font-medium">Product Weight</div>
          <p className="text-xs opacity-70 mt-2">
            Enter the weight by weighing the product after it is <a href="#" className="text-blue-500">packaged</a>.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-4 gap-5">
          <select
            className="h-10 rounded-md border px-3"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
          >
            <option value="Gram (g)">Gram (g)</option>
            <option value="Kilogram (kg)">Kilogram (kg)</option>
          </select>
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-10 rounded-md border px-3 col-span-3"
          />
        </div>
      </div>

      {/* Product Size */}
      <div className="mt-5 flex flex-col xl:flex-row gap-5">
        <div className="xl:w-64">
          <div className="font-medium">Product Size</div>
          <p className="text-xs opacity-70 mt-2">
            Enter the size after packing to calculate volume weight. <a href="#" className="text-blue-500">Learn Volume Weight</a>.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-5">
          {['width', 'height', 'length'].map((dim) => (
            <div className="flex" key={dim}>
              <input
                type="number"
                placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
                value={dimensions[dim]}
                onChange={(e) => setDimensions({ ...dimensions, [dim]: e.target.value })}
                className="h-10 w-full rounded-l-md border px-3"
              />
              <span className="w-16 flex items-center justify-center bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                cm
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Insurance */}
      <div className="mt-5 flex flex-col xl:flex-row gap-5">
        <div className="xl:w-64">
          <div className="font-medium">Shipping Insurance</div>
          <p className="text-xs opacity-70 mt-2">
            Refund product & postage in case of damage/loss. <a href="#" className="text-blue-500">Learn More</a>.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {['required', 'optional'].map((option) => (
            <label key={option} className="flex items-start space-x-2">
              <input
                type="radio"
                name="insurance"
                value={option}
                checked={insurance === option}
                onChange={() => setInsurance(option)}
                className="mt-1"
              />
              <span>
                <div className="font-medium capitalize">{option}</div>
                <div className="text-xs opacity-70 mt-1">
                  {option === 'required' ? 'Buyer must activate insurance.' : 'Buyer can optionally activate insurance.'}
                </div>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Shipping Service */}
      <div className="mt-5 flex flex-col xl:flex-row gap-5">
        <div className="xl:w-64">
          <div className="font-medium">Shipping Service</div>
          <p className="text-xs opacity-70 mt-2">
            Configure shipping services according to your product type.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {['standard', 'custom'].map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="radio"
                name="shippingService"
                value={service}
                checked={shippingService === service}
                onChange={() => setShippingService(service)}
              />
              <span className="capitalize font-medium">{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pre-order */}
      <div className="mt-5 flex flex-col xl:flex-row gap-5">
        <div className="xl:w-64">
          <div className="font-medium">Pre-order</div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preOrder}
            onChange={() => setPreOrder(!preOrder)}
            className="h-5 w-5"
          />
          <label className="text-xs opacity-70">
            Activate PreOrder for longer shipping process. <a href="#" className="text-blue-500">Learn more</a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WeightShippings;