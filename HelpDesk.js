import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import "../styles/HelpDesk.css";

const HelpDesk = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I place an order?",
      answer: "Go to the 'Menu' page, select the desired items, choose the quantity, and click 'Order Now'. Proceed to checkout and complete the payment.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order status by visiting the 'Order Tracking' page. You will see real-time updates like 'Preparing', 'Ready for Pickup', and 'Delivered'.",
      icon: <FaInfoCircle className="text-blue-500" />,
    },
    {
      question: "Can I pre-order meals?",
      answer: "Yes! You can place pre-orders for bulk or next-day meals by selecting the 'Pre-Order' option on the 'CheckOut' page.",
      icon: <FaClock className="text-purple-500" />,
    },
    {
      question: "What payment methods are available?",
      answer: "We support UPI, credit/debit cards, and net banking. All payments are secured with end-to-end encryption.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      question: "What happens if the stock is unavailable?",
      answer: "If a selected item is out of stock, you will see a 'No Stock Available' message. We'll suggest alternative options based on your preferences.",
      icon: <FaInfoCircle className="text-blue-500" />,
    },
    {
      question: "Do you offer delivery services?",
      answer: "No, you have to collect your order",
      icon: <FaMapMarkerAlt className="text-red-500" />,
    },
    {
      question: "How can I modify or cancel my order?",
      answer: "You can't cancel or modify your order once it is placed.",
      icon: <FaInfoCircle className="text-blue-500" />,
    },
    {
      question: "Are there any special discounts available?",
      answer: "Yes! We offer a 10% discount for first-time users, weekly promotions, and loyalty rewards for regular customers. Check the 'Offers' section for current deals.",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our canteen, or email at nsritsupport@gmail.com, or call us at 9999999999 between 8 AM and 10 PM.",
      icon: <FaPhoneAlt className="text-yellow-500" />,
    },
  ];

  // 🔥 Filtering FAQs based on the search query
  const filteredFaqs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Help Center</h1>
        <p className="text-gray-600">Find answers to frequently asked questions</p>
      </div>

      {/* Search Box */}
      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-4 top-4">
            <FaQuestionCircle className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-8">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => (
            <div key={index} className="mb-4">
              <div
                onClick={() => toggleAccordion(index)}
                className={`flex justify-between items-center p-4 cursor-pointer rounded-lg ${
                  activeIndex === index
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <h3 className="font-semibold text-gray-800">{item.question}</h3>
                </div>
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              {activeIndex === index && (
                <div className="p-4 bg-white border-l border-r border-b rounded-b-lg">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No results found.</p>
        )}
      </div>

      {/* Contact Support Section */}
      <div className="mt-10 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Still need help?</h3>
        <p className="text-gray-700 mb-4">
          Our customer support team is available to assist you with any questions or concerns.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpDesk;
