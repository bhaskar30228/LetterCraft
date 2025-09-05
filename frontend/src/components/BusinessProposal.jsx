import React, { useRef, useState } from 'react';
import './BusinessProposal.css';
import html2pdf from 'html2pdf.js';

const BusinessProposal = () => {
  const proposalRef = useRef(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    contactPerson: '',
    clientName: '',
    clientCompany: '',
    clientAddress: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    proposalTitle: '',
    proposalSummary: '',
    servicesOffered: '',
    pricing: '',
    timeline: '',
    benefits: '',
    termsConditions: '',
    yourClosing: 'Best regards,'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
    const element = proposalRef.current;
    const clonedElement = element.cloneNode(true);
    clonedElement.style.width = '210mm';
    clonedElement.style.padding = '20mm';
    document.body.appendChild(clonedElement);

    const opt = {
      margin: 1,
      filename: `business-proposal-${formData.companyName || 'proposal'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        windowHeight: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        ignoreElements: (el) => el.classList?.contains('bp-no-print')
      },
      jsPDF: { 
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      const pdfDataUrl = await html2pdf().set(opt).from(clonedElement).output('dataurlstring');
      return pdfDataUrl;
    } finally {
      document.body.removeChild(clonedElement);
    }
  };
  
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const pdfDataUrl = await generatePDF();
      const a = document.createElement('a');
      a.href = pdfDataUrl;
      a.download = `Business-Proposal-${formData.companyName || 'Proposal'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const handleShareToWhatsApp = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfDataUrl = await generatePDF();
      const blob = await fetch(pdfDataUrl).then(res => res.blob());
      const file = new File([blob], `business-proposal-${formData.companyName}.pdf`, { type: blob.type });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Business Proposal from ${formData.companyName}`,
          text: `Please find attached our business proposal for your review.`,
        });
      } else {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Please find attached our business proposal for your review.`)}`;
        window.open(whatsappUrl, '_blank');
        alert('Please download the PDF first and then share it through WhatsApp');
      }
    } catch (error) {
      console.error('WhatsApp share error:', error);
      alert('Failed to share via WhatsApp. Please try downloading and sharing manually.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bp-app">
      <div className="bp-controls bp-no-print">
        <h2>Business Proposal</h2>
        <div className="bp-button-group">
          <button className="bp-edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="bp-print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="bp-download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="bp-whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`bp-container ${isEditing ? 'bp-with-editor' : ''}`}>
        <div className="bp-template" ref={proposalRef}>
          <header className="bp-header">
            <div className="bp-company-info">
              <h1 className="bp-company-name">{formData.companyName || 'Your Company Name'}</h1>
              <p className="bp-company-details">
                {formData.companyAddress || 'Company Address'} • 
                {formData.companyEmail || ' contact@company.com'} • 
                {formData.companyPhone || ' (123) 456-7890'}
              </p>
            </div>
            <div className="bp-logo-placeholder">
              <div className="bp-logo-circle">
                <div className="bp-logo-inner">{formData.companyName ? formData.companyName.charAt(0) : 'C'}</div>
              </div>
            </div>
          </header>

          <div className="bp-content">
            <div className="bp-date">{formData.currentDate}</div>
            
            <div className="bp-client-info">
              <p>{formData.clientName || 'Client Name'}</p>
              <p>{formData.clientCompany || 'Client Company'}</p>
              <p>{formData.clientAddress || 'Client Address'}</p>
            </div>
            
            <div className="bp-subject">
              <h2>Proposal: {formData.proposalTitle || 'Proposal Title'}</h2>
            </div>
            
            <div className="bp-salutation">Dear {formData.clientName || 'Client Name'},</div>
            
            <div className="bp-body">
              <div className="bp-section">
                <h3 className="bp-section-title">Executive Summary</h3>
                <p className="bp-section-content">
                  {formData.proposalSummary || 'This proposal outlines the services we can provide to help achieve your business objectives. We have carefully considered your requirements and believe our solution offers the best value and results for your organization.'}
                </p>
              </div>
              
              <div className="bp-section">
                <h3 className="bp-section-title">Services Offered</h3>
                <p className="bp-section-content">
                  {formData.servicesOffered || 'We propose to deliver the following services: [Detailed description of services, deliverables, and scope of work]'}
                </p>
              </div>
              
              <div className="bp-section">
                <h3 className="bp-section-title">Investment</h3>
                <p className="bp-section-content">
                  {formData.pricing || 'The total investment for this engagement would be [Amount] payable as follows: [Payment terms and schedule]'}
                </p>
              </div>
              
              <div className="bp-section">
                <h3 className="bp-section-title">Project Timeline</h3>
                <p className="bp-section-content">
                  {formData.timeline || 'We anticipate completing this project within [Timeframe]. Key milestones include: [List major milestones with dates]'}
                </p>
              </div>
              
              <div className="bp-section">
                <h3 className="bp-section-title">Benefits</h3>
                <p className="bp-section-content">
                  {formData.benefits || 'By implementing this solution, your organization will benefit from: [List key benefits and ROI]'}
                </p>
              </div>
              
              <div className="bp-section">
                <h3 className="bp-section-title">Terms & Conditions</h3>
                <p className="bp-section-content">
                  {formData.termsConditions || 'This proposal is valid for 30 days from the date of issue. Work will commence upon receipt of signed agreement and initial payment. All work is subject to our standard terms and conditions.'}
                </p>
              </div>
              
              <p className="bp-closing-paragraph">
                We appreciate the opportunity to submit this proposal and look forward to discussing how we can partner to achieve your business goals. Please don't hesitate to contact us with any questions.
              </p>
            </div>
            
            <div className="bp-sign-off">
              <p>{formData.yourClosing}</p>
              <div className="bp-signature-line"></div>
              <p className="bp-contact-person">{formData.contactPerson || 'Your Name'}</p>
              <p className="bp-contact-title">{formData.companyName || 'Your Company Name'}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bp-editor-panel">
            <h3>Customize Your Proposal</h3>
            <div className="bp-form-grid">
              <div className="bp-form-group">
                <label>Your Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  placeholder="Company Name"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Company Address</label>
                <input 
                  type="text" 
                  name="companyAddress" 
                  value={formData.companyAddress} 
                  onChange={handleChange} 
                  placeholder="123 Business Rd, City"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Company Email</label>
                <input 
                  type="email" 
                  name="companyEmail" 
                  value={formData.companyEmail} 
                  onChange={handleChange} 
                  placeholder="contact@company.com"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Company Phone</label>
                <input 
                  type="tel" 
                  name="companyPhone" 
                  value={formData.companyPhone} 
                  onChange={handleChange} 
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Contact Person</label>
                <input 
                  type="text" 
                  name="contactPerson" 
                  value={formData.contactPerson} 
                  onChange={handleChange} 
                  placeholder="Your Name"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Client Name</label>
                <input 
                  type="text" 
                  name="clientName" 
                  value={formData.clientName} 
                  onChange={handleChange} 
                  placeholder="Client Name"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Client Company</label>
                <input 
                  type="text" 
                  name="clientCompany" 
                  value={formData.clientCompany} 
                  onChange={handleChange} 
                  placeholder="Client Company"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Client Address</label>
                <input 
                  type="text" 
                  name="clientAddress" 
                  value={formData.clientAddress} 
                  onChange={handleChange} 
                  placeholder="Client Address"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Proposal Title</label>
                <input 
                  type="text" 
                  name="proposalTitle" 
                  value={formData.proposalTitle} 
                  onChange={handleChange} 
                  placeholder="e.g., Digital Marketing Proposal"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Executive Summary</label>
                <textarea 
                  name="proposalSummary" 
                  value={formData.proposalSummary} 
                  onChange={handleChange} 
                  placeholder="Brief overview of the proposal"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Services Offered</label>
                <textarea 
                  name="servicesOffered" 
                  value={formData.servicesOffered} 
                  onChange={handleChange} 
                  placeholder="Detailed description of services"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Pricing Information</label>
                <textarea 
                  name="pricing" 
                  value={formData.pricing} 
                  onChange={handleChange} 
                  placeholder="Pricing details and payment terms"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Project Timeline</label>
                <textarea 
                  name="timeline" 
                  value={formData.timeline} 
                  onChange={handleChange} 
                  placeholder="Project schedule and milestones"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Client Benefits</label>
                <textarea 
                  name="benefits" 
                  value={formData.benefits} 
                  onChange={handleChange} 
                  placeholder="Benefits and value proposition"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Terms & Conditions</label>
                <textarea 
                  name="termsConditions" 
                  value={formData.termsConditions} 
                  onChange={handleChange} 
                  placeholder="Legal terms and conditions"
                />
              </div>
              
              <div className="bp-form-group">
                <label>Closing Salutation</label>
                <input 
                  type="text" 
                  name="yourClosing" 
                  value={formData.yourClosing} 
                  onChange={handleChange} 
                  placeholder="e.g., Best regards,"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProposal;