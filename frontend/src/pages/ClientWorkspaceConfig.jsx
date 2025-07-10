import { useState } from "react";
import Sidebar from "./Sidebar";
import SlideMenu from "./SlideMenu";
import {
  FaUpload,
  FaPalette,
  FaEye,
  FaGripVertical,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheck,
  FaCog,
  FaQuestion,
  FaTicketAlt,
  FaComments,
  FaHeadset,
  FaListUl,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

export default function ClientWorkspaceConfig() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isPermanent, setPermanent] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  // Branding state
  const [branding, setBranding] = useState({
    logo: null,
    primaryColor: "blue",
    welcomeMessage: "Welcome to your customer portal"
  });

  // Dashboard sections state
  const [dashboardSections, setDashboardSections] = useState([
    { id: 1, name: "Orders", icon: <FaListUl />, enabled: true },
    { id: 2, name: "Feedback", icon: <FaComments />, enabled: true },
    { id: 3, name: "Help", icon: <FaQuestion />, enabled: true },
    { id: 4, name: "Chat", icon: <FaComments />, enabled: false },
    { id: 5, name: "Tickets", icon: <FaTicketAlt />, enabled: true },
    { id: 6, name: "FAQs", icon: <FaQuestion />, enabled: true }
  ]);

  // Form fields state
  const [formFields, setFormFields] = useState([
    { id: 1, label: "Issue Type", type: "dropdown", required: true, options: ["Bug", "Feature Request", "Support"] },
    { id: 2, label: "Serial Number", type: "text", required: true, options: [] }
  ]);
  const [newField, setNewField] = useState({ label: "", type: "text", required: false });

  // FAQ state
  const [faqs, setFaqs] = useState([
    { id: 1, question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page." },
    { id: 2, question: "How do I submit a support ticket?", answer: "Navigate to the Support section and fill out the form." }
  ]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState(null);

  // Available colors for primary color picker
  const colors = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" }
  ];

  // Field types for form builder
  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "dropdown", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio Button" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "date", label: "Date" }
  ];

  // Menu handlers
  const handleHamburgerHover = () => {
    if (!isPermanent) setMenuOpen(true);
  };
  const handleHamburgerLeave = () => {
    if (!isPermanent && !isHoveringMenu) setMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setPermanent((prev) => !prev);
    setMenuOpen((prev) => (!isPermanent ? true : false));
  };
  const handleMenuHover = () => {
    setIsHoveringMenu(true);
    if (!isPermanent) setMenuOpen(true);
  };
  const handleMenuLeave = () => {
    setIsHoveringMenu(false);
    if (!isPermanent) setMenuOpen(false);
  };

  // Branding handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBranding(prev => ({ ...prev, logo: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  // Dashboard section handlers
  const toggleSection = (id) => {
    setDashboardSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const moveSectionUp = (id) => {
    setDashboardSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index > 0) {
        const newSections = [...prev];
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
        return newSections;
      }
      return prev;
    });
  };

  const moveSectionDown = (id) => {
    setDashboardSections(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index < prev.length - 1) {
        const newSections = [...prev];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        return newSections;
      }
      return prev;
    });
  };

  // Form field handlers
  const addFormField = () => {
    if (newField.label.trim()) {
      setFormFields(prev => [
        ...prev,
        { ...newField, id: Date.now(), options: newField.type === "dropdown" ? ["Option 1"] : [] }
      ]);
      setNewField({ label: "", type: "text", required: false });
    }
  };

  const removeFormField = (id) => {
    setFormFields(prev => prev.filter(field => field.id !== id));
  };

  // FAQ handlers
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaqs(prev => [...prev, { ...newFaq, id: Date.now() }]);
      setNewFaq({ question: "", answer: "" });
    }
  };

  const updateFaq = (id, updatedFaq) => {
    setFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, ...updatedFaq } : faq));
    setEditingFaq(null);
  };

  const deleteFaq = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  const saveConfiguration = () => {
    // Mock save functionality - would typically send to backend
    const config = {
      branding,
      dashboardSections,
      formFields,
      faqs
    };
    console.log("Saving configuration:", config);
    alert("Configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative">
      {/* Fixed narrow sidebar */}
      <Sidebar
        toggleSlideMenu={handleHamburgerClick}
        onHamburgerHover={handleHamburgerHover}
        onHamburgerLeave={handleHamburgerLeave}
        isPermanent={isPermanent}
      />

      {/* Separator Line */}
      {isMenuOpen && (
        <div className="fixed top-0 left-16 h-full z-10"></div>
      )}

      {/* Slide-out panel */}
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (!isPermanent) setMenuOpen(false);
        }}
        onMenuHover={handleMenuHover}
        onMenuLeave={handleMenuLeave}
      />

      {/* Main content */}
      <main
        className={`flex-1 px-6 py-8 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Client Workspace Configuration
          </h1>
          <p className="text-gray-400">
            Customize your client's customer dashboard experience
          </p>
        </div>

        <div className="space-y-8 max-w-6xl">
          {/* Branding Panel */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaPalette className="text-blue-400" />
              Branding Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Logo</label>
                <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
                  {branding.logo ? (
                    <img src={branding.logo} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                  ) : (
                    <FaUpload className="text-gray-500 text-2xl mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Upload Logo
                  </label>
                </div>
              </div>

              {/* Primary Color */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Primary Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBranding(prev => ({ ...prev, primaryColor: color.value }))}
                      className={`w-12 h-12 rounded-lg ${color.class} ${
                        branding.primaryColor === color.value 
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]' 
                          : 'hover:scale-105'
                      } transition-all`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Welcome Message</label>
                <textarea
                  value={branding.welcomeMessage}
                  onChange={(e) => setBranding(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter welcome message..."
                />
              </div>
            </div>
          </div>

          {/* Dashboard Layout Control */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaCog className="text-green-400" />
              Dashboard Layout Control
            </h2>
            <div className="space-y-3">
              {dashboardSections.map((section, index) => (
                <div key={section.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-600">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => toggleSection(section.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-white font-medium">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveSectionUp(section.id)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => moveSectionDown(section.id)}
                      disabled={index === dashboardSections.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowDown />
                    </button>
                    <FaGripVertical className="text-gray-500 cursor-move" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Builder */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaEdit className="text-purple-400" />
              Input Form Builder
            </h2>
            
            {/* Existing Fields */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-300">Existing Fields</h3>
              {formFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <span className="text-white font-medium">{field.label}</span>
                    <span className="text-gray-400 ml-2">({field.type})</span>
                    {field.required && <span className="text-red-400 ml-2">*</span>}
                  </div>
                  <button
                    onClick={() => removeFormField(field.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Field */}
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Add New Field</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full p-2 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Field label..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 bg-[#0f172a] border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">Required</span>
                  </label>
                </div>
                <button
                  onClick={addFormField}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus />
                  Add Field
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content Editor */}
          <div className="bg-[#1e293b] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaQuestion className="text-yellow-400" />
              FAQ Content Editor
            </h2>
            
            {/* Existing FAQs */}
            <div className="space-y-4 mb-6">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-[#0f172a] rounded-lg border border-gray-600">
                  {editingFaq === faq.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))}
                        className="w-full p-2 bg-[#1e293b] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateFaq(faq.id, faq)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          onClick={() => setEditingFaq(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{faq.question}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFaq(faq.id)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteFaq(faq.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New FAQ */}
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-300 mb-3">Add New FAQ</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter question..."
                />
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full p-3 bg-[#0f172a] border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter answer..."
                />
                <button
                  onClick={addFaq}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus />
                  Add FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Save Configuration Button */}
          <div className="flex justify-end">
            <button
              onClick={saveConfiguration}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-lg"
            >
              <FaSave />
              Save Configuration
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}