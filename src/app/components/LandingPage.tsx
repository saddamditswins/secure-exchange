import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  FileQuestion, 
  MailWarning, 
  Server, 
  UserCheck, 
  Eye, 
  Activity, 
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  AlertTriangle,
  XCircle,
  Building2
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    organization: '',
    role: '',
    customRole: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    workEmail: '',
    organization: '',
    role: '',
    customRole: '',
  });

  const roles = [
    'Dealer Principal',
    'Compliance / Risk',
    'Operations',
    'IT / Systems',
    'Other',
  ];

  // Open demo modal
  const handleOpenDemoModal = () => {
    setDemoModalOpen(true);
    setIsSubmitted(false);
  };

  // Close demo modal
  const handleCloseDemoModal = () => {
    setDemoModalOpen(false);
    // Reset form after closing
    setTimeout(() => {
      setFormData({
        fullName: '',
        workEmail: '',
        organization: '',
        role: '',
        customRole: '',
        message: '',
      });
      setFormErrors({
        fullName: '',
        workEmail: '',
        organization: '',
        role: '',
        customRole: '',
      });
      setIsSubmitted(false);
    }, 300);
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      fullName: '',
      workEmail: '',
      organization: '',
      role: '',
      customRole: '',
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.workEmail.trim()) {
      errors.workEmail = 'Work email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      errors.workEmail = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.organization.trim()) {
      errors.organization = 'Organization is required';
      isValid = false;
    }

    if (!formData.role) {
      errors.role = 'Please select your role';
      isValid = false;
    }

    // If "Other" is selected, custom role is required
    if (formData.role === 'Other' && !formData.customRole.trim()) {
      errors.customRole = 'Please enter your role';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmitDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show confirmation
    setIsSubmitted(true);
  };

  // Check if form is complete
  const isFormComplete = 
    formData.fullName.trim() !== '' &&
    formData.workEmail.trim() !== '' &&
    formData.organization.trim() !== '' &&
    (formData.role !== '' || formData.customRole !== '');

  // Keyboard support for modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && demoModalOpen) {
      handleCloseDemoModal();
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#153240] text-[#FFFFFF] font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3], 
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#153240]/95 backdrop-blur-md border-b border-[#243F4D]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20"
            >
              <ShieldCheck className="w-6 h-6 text-[#153240]" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">Secure Exchange</span>
          </div>

          {/* Right Action - Only Login & Demo */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-[#FFFFFF] hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Login
            </button>
            <motion.button 
              onClick={handleOpenDemoModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#153240] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer shadow-lg shadow-emerald-900/20"
            >
              REQUEST A DEMO
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-300 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="md:hidden bg-[#153240] border-b border-[#243F4D] px-6 py-4 space-y-4"
          >
            <div className="flex flex-col gap-3">
              <button 
                onClick={onLoginClick}
                className="w-full text-left text-neutral-300 hover:text-[#FFFFFF] py-2 cursor-pointer"
              >
                Login
              </button>
              <button className="w-full px-5 py-3 bg-emerald-500 text-[#153240] font-bold rounded-lg text-center cursor-pointer">
                REQUEST A DEMO
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-40 pb-32 px-6 relative overflow-hidden flex items-center min-h-[75vh]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 relative z-10"
          >
            {/* Headline */}
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-7xl font-bold leading-tight tracking-tight"
            >
              Secure documents. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Secure exchange.</span> <br />
              Confident signing.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-neutral-300 max-w-4xl mx-auto leading-relaxed"
            >
              Secure Exchange is the external document decision layer that governs how automotive dealerships share and sign sensitive documents — without losing control, visibility, or proof.
            </motion.p>

            {/* Buyer Qualifier */}
            <motion.p 
              variants={fadeIn}
              className="text-base text-neutral-400 max-w-3xl mx-auto"
            >
              Built for dealership principals, compliance leaders, and operations heads who own document risk.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={fadeIn} className="flex flex-col items-center gap-4 pt-4">
              <motion.button 
                onClick={handleOpenDemoModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#153240] font-bold rounded-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer text-lg"
              >
                REQUEST A DEMO
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              {/* CTA Microcopy */}
              <p className="text-sm text-neutral-500">
                Pilot on real dealership documents. No workflow replacement required.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PROBLEM FRAMING - RISK & BUSINESS IMPACT */}
      <section className="py-24 bg-[#0F2936]/50 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Most organizations think their risk ends when they hit "Send."
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              In reality, that's where exposure begins — during audits, disputes, and regulatory review, when proof matters most.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: MailWarning, 
                color: "text-rose-400", 
                title: "Lost Control", 
                desc: "Links stay open and files get forwarded. Once shared, access can't be reliably contained." 
              },
              { 
                icon: Eye, 
                color: "text-amber-400", 
                title: "Zero Visibility", 
                desc: "You can't prove who accessed documents, when they did, or from where." 
              },
              { 
                icon: FileQuestion, 
                color: "text-purple-400", 
                title: "Indefensible", 
                desc: "When disputes or audits arise, evidence is fragmented, delayed, or missing." 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                whileHover={{ y: -10, borderColor: "rgba(16,185,129,0.5)" }}
                className="bg-[#153240] p-8 rounded-xl border border-[#243F4D] transition-all duration-300 group hover:shadow-2xl hover:shadow-emerald-900/10"
              >
                <div className="w-14 h-14 bg-[#1E3A4A] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#FFFFFF]">{item.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. GOVERNANCE POSITIONING - BEYOND THE BOUNDARY */}
      <section className="py-24 px-6 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="relative z-10 bg-[#1E3A4A] rounded-xl border border-[#243F4D] p-1 shadow-2xl">
               <div className="grid grid-cols-3 gap-1 bg-[#153240] rounded-lg p-6 text-center relative overflow-hidden">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-60 z-10">
                    <Server className="w-12 h-12 text-neutral-400" />
                    <span className="text-xs font-mono text-neutral-400">DEALERTRACK</span>
                  </div>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-700 via-emerald-500 to-neutral-700 -z-10"></div>
                    <motion.div 
                      animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 30px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 bg-[#153240] border-2 border-emerald-500 rounded-full flex items-center justify-center z-10"
                    >
                      <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <span className="text-xs font-bold text-emerald-500 mt-4 uppercase tracking-wider">Decision Layer</span>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-60 z-10">
                    <UserCheck className="w-12 h-12 text-neutral-400" />
                    <span className="text-xs font-mono text-neutral-400">EXTERNAL</span>
                  </div>

                  {/* Animated Particles */}
                  <motion.div 
                    animate={{ x: [-100, 400], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-0 w-2 h-2 bg-emerald-400 rounded-full blur-[2px] z-0"
                  />
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="order-1 lg:order-2 space-y-6"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold">
              Governance Beyond the Boundary
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-neutral-400 leading-relaxed">
              Secure Exchange governs how finalized documents originating from Dealertrack are shared and signed externally — while Dealertrack remains your system of record.
            </motion.p>
            
            <ul className="space-y-4 pt-4">
              {[
                { title: "Controlled Sharing", desc: "Time-bound, revocable access with identity verification" },
                { title: "Audit-Ready", desc: "Retrieve complete, decision-grade document evidence during audits or disputes" },
                { title: "Seamless Workflow", desc: "Pull finalized PDFs directly from Dealertrack without disrupting dealership operations" }
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  variants={fadeIn}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#FFFFFF] mb-1">{item.title}</h4>
                    <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 5. BUSINESS IMPACT - EXECUTIVE OUTCOMES */}
      <section className="py-20 bg-[#0F2936]/50 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What This Changes for Your Business</h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              "Fewer document-related disputes and chargebacks",
              "Faster audit response with defensible proof",
              "Reduced compliance overhead and manual investigations",
              "Lower risk exposure after deals are finalized"
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                className="flex items-start gap-3 bg-[#153240] p-6 rounded-lg border border-[#243F4D] hover:border-emerald-500/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-300 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. ANCHOR DECISION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-wider">
                <Lock className="w-4 h-4" /> Governance Core
              </div>
              <motion.h3 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">
                The "Anchor Decision"
              </motion.h3>
              <motion.p variants={fadeIn} className="text-lg text-neutral-400 leading-relaxed">
                Ensure every external document exchange is safe, compliant, and explicitly approved to continue.
              </motion.p>
              <div className="space-y-4 border-l-2 border-[#243F4D] pl-6">
                <motion.div variants={fadeIn}>
                  <h4 className="text-[#FFFFFF] font-semibold mb-2">Immutable Records</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Every approval creates a permanent, replayable decision record
                  </p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <h4 className="text-[#FFFFFF] font-semibold mb-2">Revoke Anytime</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Pause or revoke external access at any time after approval
                  </p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#1E3A4A] p-6 rounded-xl border border-[#243F4D] shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all"
            >
              {/* Mock UI */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#243F4D] pb-3">
                  <span className="font-semibold text-[#FFFFFF]">Decision Record</span>
                  <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-700/30">PENDING REVIEW</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">External Recipient</label>
                    <div className="bg-[#153240] p-2 rounded text-sm text-[#FFFFFF] border border-[#243F4D]">michael.thompson@customer.com</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Access Expiry</label>
                      <div className="bg-[#153240] p-2 rounded text-sm text-[#FFFFFF] border border-[#243F4D]">72 Hours</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Permissions</label>
                      <div className="bg-[#153240] p-2 rounded text-sm text-[#FFFFFF] border border-[#243F4D]">View + Sign</div>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 rounded-lg text-sm font-semibold mt-2 hover:bg-emerald-600/30 transition-colors cursor-pointer"
                >
                  Commit External Access
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. AI RISK INTELLIGENCE */}
      <section className="py-20 bg-[#0F2936]/50 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 bg-[#1E3A4A] p-8 rounded-xl border border-[#243F4D] shadow-xl flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {/* Mock AI Widget */}
              <div className="text-center space-y-4 max-w-xs w-full relative z-10">
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border-4 border-[#243F4D]"></div>
                   <motion.div 
                    initial={{ rotate: -180 }}
                    whileInView={{ rotate: -45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-l-transparent"
                   />
                   <div className="text-center">
                     <span className="block text-2xl font-bold text-[#FFFFFF]">LOW</span>
                     <span className="text-xs text-neutral-400">RISK</span>
                   </div>
                </div>
                <div className="bg-[#153240] p-3 rounded-lg border border-[#243F4D] text-left">
                  <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse" /> ADVISORY SIGNAL
                  </div>
                  <div className="text-xs text-[#FFFFFF]">No unusual patterns. Verified access location.</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-sm uppercase tracking-wider">
                <Activity className="w-4 h-4" /> AI Advisory
              </div>
              <motion.h3 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-[#FFFFFF]">
                AI Risk Intelligence
              </motion.h3>
              <motion.p variants={fadeIn} className="text-lg text-neutral-400 leading-relaxed">
                AI that reduces the cost of paying attention — without replacing judgment.
              </motion.p>
              <div className="space-y-4 border-l-2 border-[#243F4D] pl-6">
                <motion.div variants={fadeIn}>
                  <h4 className="text-[#FFFFFF] font-semibold mb-2">Always-On Monitoring</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Flags unusual access patterns, stalled signatures, or high-risk data
                  </p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <h4 className="text-[#FFFFFF] font-semibold mb-2">Human Control</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    AI provides advisory risk signals (Low / Medium / High). Final decisions are always human-owned.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. MID-MARKET POSITIONING */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <div className="text-center max-w-3xl mx-auto">
              <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
                Built for Mid-Market Dealership Groups
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-neutral-400">
                Designed for multi-location dealership groups with real compliance accountability.
              </motion.p>
            </div>

            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 pt-8"
            >
              {[
                { 
                  role: "Dealer Principal", 
                  icon: Building2,
                  color: "border-emerald-500", 
                  desc: "Owns regulatory exposure and chargeback liability — needs defensible proof" 
                },
                { 
                  role: "Compliance Head", 
                  icon: ShieldCheck,
                  color: "border-blue-500", 
                  desc: "Responsible for audit readiness without manual file hunting or gaps" 
                },
                { 
                  role: "Operations Leader", 
                  icon: Activity,
                  color: "border-purple-500", 
                  desc: "Manages document workflow efficiency while maintaining governance standards" 
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeIn}
                  whileHover={{ y: -10, borderColor: "rgba(16,185,129,0.5)" }}
                  className={`bg-[#1E3A4A] p-6 rounded-xl border-l-4 ${item.color} transition-all hover:shadow-xl hover:shadow-emerald-900/10`}
                >
                  <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <h4 className="font-bold text-[#FFFFFF] text-lg mb-2">{item.role}</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 9. COMPETITIVE DIFFERENTIATION */}
      <section className="py-20 bg-[#0F2936]/80 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why We Win</h2>
            <p className="text-neutral-400">Governance advantage, not feature comparison</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-xl border border-[#243F4D] shadow-2xl"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#153240]">
                  <th className="p-6 text-neutral-400 font-semibold border-b border-[#243F4D] w-1/2 text-sm">Generic E-Signature Tools</th>
                  <th className="p-6 text-emerald-400 font-bold border-b border-emerald-500/30 bg-emerald-900/10 w-1/2">Secure Exchange</th>
                </tr>
              </thead>
              <tbody className="bg-[#1E3A4A]">
                {[
                  { 
                    std: "Focus only on signature capture and completion", 
                    secure: "Governs the full document lifecycle before, during, and after signing" 
                  },
                  { 
                    std: "No ongoing access control after sending", 
                    secure: "Time-bound, revocable, continuously monitored access" 
                  },
                  { 
                    std: "Limited or fragmented audit evidence", 
                    secure: "Decision Replay: Reconstruct the exact approved exposure state years later" 
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[#243F4D] last:border-0 hover:bg-[#243F4D]/30 transition-colors">
                    <td className="p-6 text-neutral-400 text-sm leading-relaxed">{row.std}</td>
                    <td className="p-6 text-[#FFFFFF] font-medium bg-emerald-900/5 text-sm leading-relaxed">{row.secure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* 10. TRUST FILTER - WHAT WE ARE NOT */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Secure Exchange Is Not</h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-4 mb-8"
          >
            {[
              "Not a file storage system",
              "Not a generic e-signature tool",
              "Not an automated decision engine",
              "Not AI making compliance decisions"
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                className="flex items-center gap-3 bg-[#1E3A4A] p-4 rounded-lg border border-[#243F4D]"
              >
                <XCircle className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                <p className="text-neutral-400">{item}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#153240] border border-[#243F4D] rounded-xl p-6 text-center"
          >
            <p className="text-lg text-neutral-300 leading-relaxed">
              Secure Exchange exists to <span className="text-emerald-400 font-semibold">support human judgment</span> — not replace it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 11. FINAL CTA - LEADERSHIP CALL */}
      <section className="py-24 px-6 text-center relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#243F4D] to-transparent"></div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 max-w-3xl mx-auto space-y-8"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6"
          >
             <ShieldCheck className="w-8 h-8 text-[#153240]" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold">Stop Guessing. Start Governing.</h2>
          <p className="text-xl text-neutral-400 leading-relaxed">
            Don't wait for an audit or dispute to find out you lack proof.
          </p>
          <motion.button 
            onClick={handleOpenDemoModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#153240] text-lg font-bold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all cursor-pointer shadow-xl shadow-emerald-900/30"
          >
            REQUEST A DEMO
          </motion.button>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#243F4D] to-transparent"></div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-[#0F2936] py-12 px-6 border-t border-[#243F4D] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#153240]" />
            </div>
            <span className="font-bold text-lg">Secure Exchange</span>
          </div>
          <div className="text-sm text-neutral-500">
            © 2026 Secure Exchange. External Document Decision Layer.
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 ${demoModalOpen ? 'flex' : 'hidden'}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative m-auto w-full max-w-2xl bg-[#153240] rounded-xl shadow-2xl shadow-emerald-900/20 p-6">
          <button 
            className="absolute top-3 right-3 p-2 text-neutral-300 cursor-pointer"
            onClick={handleCloseDemoModal}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Request a Demo</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Fill out the form below to schedule a demo and learn how Secure Exchange can help your dealership group.
            </p>

            <form onSubmit={handleSubmitDemoRequest}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full p-2.5 bg-[#1E3A4A] rounded-lg border text-[#FFFFFF] placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-text ${formErrors.fullName ? 'border-red-500' : 'border-[#243F4D]'}`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-400">{formErrors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Work Email *</label>
                  <input 
                    type="email" 
                    value={formData.workEmail}
                    onChange={(e) => handleFieldChange('workEmail', e.target.value)}
                    placeholder="you@company.com"
                    className={`w-full p-2.5 bg-[#1E3A4A] rounded-lg border text-[#FFFFFF] placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-text ${formErrors.workEmail ? 'border-red-500' : 'border-[#243F4D]'}`}
                  />
                  {formErrors.workEmail && (
                    <p className="text-xs text-red-400">{formErrors.workEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Organization / Dealership Group *</label>
                  <input 
                    type="text" 
                    value={formData.organization}
                    onChange={(e) => handleFieldChange('organization', e.target.value)}
                    placeholder="Enter your organization"
                    className={`w-full p-2.5 bg-[#1E3A4A] rounded-lg border text-[#FFFFFF] placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-text ${formErrors.organization ? 'border-red-500' : 'border-[#243F4D]'}`}
                  />
                  {formErrors.organization && (
                    <p className="text-xs text-red-400">{formErrors.organization}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400">Role *</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => {
                      handleFieldChange('role', e.target.value);
                      // Clear custom role if not "Other"
                      if (e.target.value !== 'Other') {
                        handleFieldChange('customRole', '');
                      }
                    }}
                    className={`w-full p-2.5 bg-[#1E3A4A] rounded-lg border text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer ${formErrors.role ? 'border-red-500' : 'border-[#243F4D]'}`}
                  >
                    <option value="">Select your role</option>
                    {roles.map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="text-xs text-red-400">{formErrors.role}</p>
                  )}
                </div>
              </div>

              {/* Conditional Custom Role Input */}
              {formData.role === 'Other' && (
                <div className="space-y-2 mt-4 transition-all">
                  <label className="text-xs text-neutral-400">Enter Your Role *</label>
                  <input 
                    type="text" 
                    value={formData.customRole}
                    onChange={(e) => handleFieldChange('customRole', e.target.value)}
                    placeholder="Enter your role"
                    autoFocus
                    className={`w-full p-2.5 bg-[#1E3A4A] rounded-lg border text-[#FFFFFF] placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-text ${formErrors.customRole ? 'border-red-500' : 'border-[#243F4D]'}`}
                  />
                  {formErrors.customRole && (
                    <p className="text-xs text-red-400">{formErrors.customRole}</p>
                  )}
                </div>
              )}

              <div className="space-y-2 mt-4">
                <label className="text-xs text-neutral-400">Message (Optional)</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  className="w-full p-2 bg-[#1E3A4A] rounded-lg border border-[#243F4D] h-24"
                />
              </div>

              <div className="mt-6">
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#153240] font-bold rounded-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all cursor-pointer shadow-xl shadow-emerald-900/30"
                >
                  {isSubmitted ? 'Demo Requested!' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}