import React, { useState } from "react";
import {
  FaChevronDown, FaChevronUp, FaTicketAlt, FaCheckCircle, FaExclamationCircle, FaQuestionCircle, FaEnvelope, FaPhoneAlt, FaRegCommentDots, FaClipboardList, FaInbox, FaCommentDots, FaUserCircle, FaBars, FaTimes, FaHome, FaComments, FaInfoCircle, FaClock, FaArrowRight, FaTrendingUp, FaHeadset, FaStar, FaLightbulb
} from "react-icons/fa";
import signupImage from "../assets/Signup.png";

const issueTypes = [
  "Product Defect",
  "Late Delivery",
  "Payment Issue",
  "Other",
];

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order status in your account dashboard under 'Orders'.",
  },
  {
    question: "What should I do if I receive a defective product?",
    answer:
      "Please raise an issue using the form below and our support team will assist you promptly.",
  },
  {
    question: "How do I request a refund?",
    answer:
      "Contact our support team via email or phone with your order details to initiate a refund.",
  },
  {
    question: "Can I change my delivery address after placing an order?",
    answer:
      "If your order hasn't shipped yet, contact us as soon as possible to update your address.",
  },
];

const initialTickets = [
  {
    id: "TCK-1001",
    type: "Feedback",
    subject: "Great product, but could use more integrations",
    status: "Resolved",
    date: "2024-05-01",
  },
  {
    id: "TCK-1002",
    type: "Issue",
    subject: "Received a defective item",
    status: "Open",
    date: "2024-05-10",
  },
  {
    id: "TCK-1003",
    type: "Issue",
    subject: "Payment not reflecting",
    status: "In Progress",
    date: "2024-05-15",
  },
];

export default function CustomerPortal() {
  // Feedback form state
  const [feedback, setFeedback] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  // Issue form state
  const [issue, setIssue] = useState({
    name: "",
    email: "",
    type: issueTypes[0],
    description: "",
  });
  const [issueErrors, setIssueErrors] = useState({});
  const [issueMsg, setIssueMsg] = useState("");
  // Collapsible state
  const [openSection, setOpenSection] = useState(null); // 'feedback', 'issue', 'faq'
  const [openFaq, setOpenFaq] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);

  // Get user name from localStorage
  let userName = "Customer";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) userName = user.username;
  } catch {}

  // Get recent tickets (last 3)
  const recentTickets = tickets.slice(-3);
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;
  const resolvedTicketsCount = tickets.filter(t => t.status === 'Resolved').length;

  // Stat widgets (enhanced design)
  const statWidgets = [
    {
      icon: <FaClipboardList className="text-blue-400 text-3xl" />,
      label: "Total Tickets",
      value: tickets.length,
      change: "+2 this month",
      bg: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
      border: "border-blue-400/30",
    },
    {
      icon: <FaCheckCircle className="text-green-400 text-3xl" />,
      label: "Resolved",
      value: resolvedTicketsCount,
      change: `${Math.round((resolvedTicketsCount / tickets.length) * 100) || 0}% success rate`,
      bg: "bg-gradient-to-br from-green-500/20 to-green-600/10",
      border: "border-green-400/30",
    },
    {
      icon: <FaClock className="text-yellow-400 text-3xl" />,
      label: "Pending",
      value: openTicketsCount,
      change: "Avg. 2 days response",
      bg: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
      border: "border-yellow-400/30",
    },
  ];

  // Quick action cards
  const quickActions = [
    {
      icon: <FaRegCommentDots className="text-blue-400 text-2xl" />,
      title: "Submit Feedback",
      description: "Share your thoughts and help us improve",
      action: () => toggleSection('feedback'),
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      border: "border-blue-400/20",
    },
    {
      icon: <FaExclamationCircle className="text-red-400 text-2xl" />,
      title: "Report Issue",
      description: "Get quick help with any problems",
      action: () => toggleSection('issue'),
      bg: "bg-gradient-to-br from-red-500/10 to-red-600/5",
      border: "border-red-400/20",
    },
    {
      icon: <FaQuestionCircle className="text-purple-400 text-2xl" />,
      title: "Browse FAQ",
      description: "Find answers to common questions",
      action: () => toggleSection('faq'),
      bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
      border: "border-purple-400/20",
    },
  ];

  // Feedback submit handler
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackMsg("Please enter your feedback.");
      return;
    }
    setTickets([
      ...tickets,
      {
        id: `TCK-${1000 + tickets.length + 1}`,
        type: "Feedback",
        subject: feedback,
        status: "Open",
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setFeedbackMsg("Thank you for your feedback!");
    setFeedback("");
  };

  // Issue form validation
  const validateIssue = () => {
    const errors = {};
    if (!issue.name.trim()) errors.name = "Name is required.";
    if (!issue.email.trim()) errors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(issue.email))
      errors.email = "Invalid email address.";
    if (!issue.description.trim()) errors.description = "Description is required.";
    return errors;
  };

  // Issue submit handler
  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const errors = validateIssue();
    setIssueErrors(errors);
    if (Object.keys(errors).length === 0) {
      setTickets([
        ...tickets,
        {
          id: `TCK-${1000 + tickets.length + 1}`,
          type: "Issue",
          subject: issue.description,
          status: "Open",
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setIssueMsg("Your issue has been submitted. Our team will contact you soon.");
      setIssue({ name: "", email: "", type: issueTypes[0], description: "" });
    } else {
      setIssueMsg("");
    }
  };

  // Collapsible toggle
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Side panel links
  const navLinks = [
    { label: "Dashboard", icon: <FaHome />, href: "#dashboard" },
    { label: "Quick Actions", icon: <FaTrendingUp />, href: "#actions" },
    { label: "Recent Activity", icon: <FaClock />, href: "#recent" },
    { label: "Support", icon: <FaHeadset />, href: "#support" },
    { label: "FAQ", icon: <FaQuestionCircle />, href: "#faq" },
    { label: "Contact", icon: <FaEnvelope />, href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Side Panel */}
      <aside className="fixed left-0 top-0 bottom-0 h-screen w-64 bg-slate-800/95 backdrop-blur-sm shadow-2xl border-r border-slate-700/50 z-30"> 
        <div className="flex flex-col items-center py-8 px-4">
          <div className="relative">
            <FaUserCircle className="text-6xl text-blue-400 mb-3 drop-shadow-lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="text-xl font-bold text-white mb-1">{userName}</div>
          <div className="text-sm text-slate-400 mb-4 font-medium">Customer Portal</div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-4">
          {navLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all group">
              <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto flex justify-center pb-6 md:hidden">
          <button onClick={() => setSideOpen(false)} className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"><FaTimes /></button>
        </div>
      </aside>
      {/* Hamburger for mobile */}
      <button className="fixed top-4 left-4 z-40 md:hidden p-3 rounded-xl bg-slate-800/90 backdrop-blur-sm shadow-lg hover:bg-slate-700 text-white transition-all" onClick={() => setSideOpen(true)}><FaBars /></button>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 transition-all duration-300 w-full ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome back, {userName}!
                </h1>
                <p className="text-slate-400 text-lg">Here's your support dashboard overview</p>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Support Online</span>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statWidgets.map((stat, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 ${stat.bg} ${stat.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/5">{stat.icon}</div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <FaTrendingUp className="text-green-400" />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaLightbulb className="text-yellow-400 text-xl" />
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className={`p-6 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 text-left group ${action.bg} ${action.border}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">{action.icon}</div>
                    <FaArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Sections */}
          {openSection && (
            <div className="mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                {openSection === 'feedback' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FaRegCommentDots className="text-blue-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">Submit Feedback</h3>
                    </div>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <textarea
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 min-h-[120px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                        placeholder="Share your thoughts, suggestions, or experiences with us..."
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                          setFeedbackMsg("");
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setOpenSection(null)}
                          className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                          Submit Feedback
                        </button>
                      </div>
                      {feedbackMsg && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                          {feedbackMsg}
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {openSection === 'issue' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FaExclamationCircle className="text-red-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">Report an Issue</h3>
                    </div>
                    <form onSubmit={handleIssueSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Name</label>
                          <input
                            type="text"
                            className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.name ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                            value={issue.name}
                            onChange={(e) => setIssue({ ...issue, name: e.target.value })}
                          />
                          {issueErrors.name && <span className="text-xs text-red-400 mt-1 block">{issueErrors.name}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">Email</label>
                          <input
                            type="email"
                            className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 focus:ring-2 transition-all ${issueErrors.email ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                            value={issue.email}
                            onChange={(e) => setIssue({ ...issue, email: e.target.value })}
                          />
                          {issueErrors.email && <span className="text-xs text-red-400 mt-1 block">{issueErrors.email}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Issue Type</label>
                        <select
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          value={issue.type}
                          onChange={(e) => setIssue({ ...issue, type: e.target.value })}
                        >
                          {issueTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <textarea
                          className={`w-full bg-slate-900/50 border rounded-xl text-white px-4 py-3 min-h-[100px] focus:ring-2 transition-all resize-none ${issueErrors.description ? "border-red-400 focus:ring-red-400/20" : "border-slate-700 focus:border-blue-400 focus:ring-blue-400/20"}`}
                          value={issue.description}
                          onChange={(e) => setIssue({ ...issue, description: e.target.value })}
                          placeholder="Please describe your issue in detail..."
                        />
                        {issueErrors.description && <span className="text-xs text-red-400 mt-1 block">{issueErrors.description}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setOpenSection(null)}
                          className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                        >
                          Submit Issue
                        </button>
                      </div>
                      {issueMsg && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                          {issueMsg}
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {openSection === 'faq' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FaQuestionCircle className="text-purple-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-3">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-slate-700/50 rounded-xl overflow-hidden">
                          <button
                            className="w-full text-left px-4 py-4 hover:bg-slate-700/30 transition-colors flex justify-between items-center"
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          >
                            <span className="font-medium text-white">{faq.question}</span>
                            <span className="text-purple-400">{openFaq === idx ? <FaChevronUp /> : <FaChevronDown />}</span>
                          </button>
                          {openFaq === idx && (
                            <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50">
                              <div className="pt-3">{faq.answer}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity & Support */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity Summary */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-blue-400 text-xl" />
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                  </div>
                  {tickets.length > 3 && (
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                      View All <FaArrowRight className="text-xs" />
                    </button>
                  )}
                </div>
                
                {recentTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaClipboardList className="text-slate-600 text-4xl mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No recent activity</p>
                    <p className="text-slate-500 text-sm">Your tickets and feedback will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTickets.reverse().map((ticket) => (
                      <div key={ticket.id} className="flex items-center gap-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                        <div className={`p-2 rounded-lg ${ticket.type === 'Issue' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {ticket.type === 'Issue' ? <FaExclamationCircle /> : <FaRegCommentDots />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{ticket.subject}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400">{ticket.id}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">{ticket.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.status === 'Resolved' && <span className="flex items-center gap-1 text-green-400 text-sm"><FaCheckCircle className="text-xs" /> Resolved</span>}
                          {ticket.status === 'Open' && <span className="flex items-center gap-1 text-red-400 text-sm"><FaExclamationCircle className="text-xs" /> Open</span>}
                          {ticket.status === 'In Progress' && <span className="flex items-center gap-1 text-yellow-400 text-sm"><FaClock className="text-xs" /> In Progress</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Support Contact */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaHeadset className="text-green-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Need Help?</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <FaEnvelope className="text-blue-400" />
                      <span className="text-white font-medium">Email Support</span>
                    </div>
                    <p className="text-slate-400 text-sm">support@company.com</p>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <FaPhoneAlt className="text-green-400" />
                      <span className="text-white font-medium">Phone Support</span>
                    </div>
                    <p className="text-slate-400 text-sm">+1 (800) 123-4567</p>
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-2">
                      <FaClock className="text-yellow-400" />
                      <span className="text-white font-medium">Support Hours</span>
                    </div>
                    <p className="text-slate-400 text-sm">Mon–Fri, 9am–6pm EST</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <FaStar className="text-yellow-400" />
                    <span>4.9/5 satisfaction rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 