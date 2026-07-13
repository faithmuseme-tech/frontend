import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Rating from "../Rating/Rating";

const TestimonialCard = ({ testimonial }) => {
  const { name, role, avatar, rating, text } = testimonial;

  return (
    <div className="card p-6 flex flex-col gap-4 h-full">
      <FaQuoteLeft className="text-primary-200 text-2xl" />
      <p className="text-gray-600 text-sm leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <img
          src={avatar}
          alt={name}
          loading="lazy"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
        <div className="ml-auto">
          <Rating value={rating} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
