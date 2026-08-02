import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import messageService from '../services/messageService';

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email address.";
    if (!formData.subject.trim()) return "Subject is required.";
    if (!formData.message.trim()) return "Message cannot be empty.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: 'error', text: validationError });
      return;
    }

    setSubmitting(true);
    try {
      await messageService.sendMessage(formData);
      setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="contact" className="py-20 px-4 bg-slate-50 dark:bg-dark-bg/60 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            Get In Touch
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Column 1: Info */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-xl font-bold font-sans text-slate-800 dark:text-white">
              Contact Information
            </h3>
            <p className="text-sm text-slate-500 dark:text-dark-textMuted">
              Have an opening, a project idea, or just want to connect? Send a message directly.
            </p>

            <div className="space-y-4 pt-4">
              {socialLinks.email && (
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-primary-500 shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500">Email Me</h4>
                    <a href={`mailto:${socialLinks.email}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-500">
                      {socialLinks.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-indigo-500 shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500">Location</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    West Bengal, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="md:col-span-7 bg-white dark:bg-dark-card/50 p-6 md:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4.5">
              
              {/* Status Alert Notification */}
              {status.type && (
                <div 
                  className={`flex items-start gap-2.5 p-4 rounded-xl text-sm border ${
                    status.type === 'error'
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {status.type === 'error' ? (
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{status.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="john@example.com"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Inquiry about full-stack opportunity"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Hey, let's talk about building..."
                  disabled={submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-200"
                disabled={submitting}
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
