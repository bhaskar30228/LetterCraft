import React, { useRef, useState } from 'react';
import './ResignationLetter.css';
import html2pdf from 'html2pdf.js';

const ResignationLetter = () => {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    yourName: '',
    yourPosition: '',
    yourDepartment: '',
    yourEmail: '',
    yourPhone: '',
    hrName: 'HR Manager',
    companyName: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    lastWorkingDay: '',
    noticePeriod: '',
    reason: '',
    gratitudeMessage: 'I appreciate the opportunities for growth and development you have provided me.',
    yourClosing: 'Sincerely,'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateLastWorkingDay = () => {
    if (formData.noticePeriod && formData.currentDate) {
      const noticeDays = parseInt(formData.noticePeriod) || 0;
      const currentDate = new Date(formData.currentDate);
      const lastDay = new Date(currentDate);
      lastDay.setDate(currentDate.getDate() + noticeDays);
      setFormData(prev => ({ 
        ...prev, 
        lastWorkingDay: lastDay.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      }));
    }
  };

  const generatePDF = async () => {
    const element = letterRef.current;
    const clonedElement = element.cloneNode(true);
    clonedElement.style.width = '210mm';
    clonedElement.style.padding = '20mm';
    document.body.appendChild(clonedElement);

    const opt = {
      margin: 1,
      filename: `resignation-letter-${formData.yourName || 'application'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        windowHeight: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        ignoreElements: (el) => el.classList?.contains('rl-no-print')
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
      a.download = `Resignation-Letter-${formData.yourName || 'Application'}.pdf`;
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
      const file = new File([blob], `resignation-letter-${formData.yourName}.pdf`, { type: blob.type });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Resignation Letter from ${formData.yourName}`,
          text: `Please find attached my resignation letter.`,
        });
      } else {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Please find attached my resignation letter.`)}`;
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
    <div className="rl-app">
      <div className="rl-controls rl-no-print">
        <h2>Resignation Letter</h2>
        <div className="rl-button-group">
          <button className="rl-edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="rl-print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="rl-download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="rl-whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`rl-container ${isEditing ? 'rl-with-editor' : ''}`}>
        <div className="rl-template" ref={letterRef}>
          <header className="rl-header">
            <div className="rl-sender-info">
              <h1 className="rl-name">{formData.yourName || 'Your Name'}</h1>
              <p className="rl-contact-info">
                {formData.yourPosition || 'Your Position'} • 
                {formData.yourDepartment || 'Your Department'} • 
                {formData.yourEmail || ' your@email.com'} • 
                {formData.yourPhone || ' (123) 456-7890'}
              </p>
            </div>
            <div className="rl-logo-placeholder">
              <div className="rl-logo-circle"></div>
            </div>
          </header>

          <div className="rl-content">
            <div className="rl-date">{formData.currentDate}</div>
            
            <div className="rl-recipient-info">
              <p>{formData.hrName || 'HR Manager'}</p>
              <p>{formData.companyName || 'Company Name'}</p>
            </div>
            
            <div className="rl-salutation">Dear {formData.hrName || 'HR Manager'},</div>
            
            <div className="rl-body">
              <p className="rl-opening-paragraph">
                I am writing to formally announce my resignation from my position as {formData.yourPosition || 'Your Position'} 
                at {formData.companyName || 'Company Name'}, effective {formData.lastWorkingDay || 'last working day'}.
              </p>
              
              <p>
                As per my notice period of {formData.noticePeriod || 'notice period'} days, my last working day will be {formData.lastWorkingDay || 'last working day'}.
              </p>
              
              <p>
                {formData.reason || 'The reason for my resignation is [brief explanation].'} {formData.gratitudeMessage}
              </p>
              
              <p className="rl-closing-paragraph">
                I am grateful for the opportunity to have worked with the team and for the valuable experiences I've gained during my tenure. 
                Please let me know how I can help during this transition period.
              </p>
            </div>
            
            <div className="rl-sign-off">
              <p>{formData.yourClosing}</p>
              <div className="rl-signature-line"></div>
              <p className="rl-name">{formData.yourName || 'Your Name'}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="rl-editor-panel">
            <h3>Customize Your Resignation Letter</h3>
            <div className="rl-form-grid">
              <div className="rl-form-group">
                <label>Your Full Name</label>
                <input 
                  type="text" 
                  name="yourName" 
                  value={formData.yourName} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Your Position</label>
                <input 
                  type="text" 
                  name="yourPosition" 
                  value={formData.yourPosition} 
                  onChange={handleChange} 
                  placeholder="Software Engineer"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Your Department</label>
                <input 
                  type="text" 
                  name="yourDepartment" 
                  value={formData.yourDepartment} 
                  onChange={handleChange} 
                  placeholder="IT Department"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Your Email</label>
                <input 
                  type="email" 
                  name="yourEmail" 
                  value={formData.yourEmail} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Your Phone</label>
                <input 
                  type="tel" 
                  name="yourPhone" 
                  value={formData.yourPhone} 
                  onChange={handleChange} 
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="rl-form-group">
                <label>HR Manager Name</label>
                <input 
                  type="text" 
                  name="hrName" 
                  value={formData.hrName} 
                  onChange={handleChange} 
                  placeholder="HR Manager"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  placeholder="Acme Inc."
                />
              </div>
              
              <div className="rl-form-group">
                <label>Notice Period (Days)</label>
                <input 
                  type="number" 
                  name="noticePeriod" 
                  value={formData.noticePeriod} 
                  onChange={handleChange} 
                  onBlur={calculateLastWorkingDay}
                  placeholder="30"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Last Working Day</label>
                <input 
                  type="text" 
                  name="lastWorkingDay" 
                  value={formData.lastWorkingDay} 
                  onChange={handleChange} 
                  readOnly
                />
              </div>
              
              <div className="rl-form-group">
                <label>Reason for Resignation</label>
                <textarea 
                  name="reason" 
                  value={formData.reason} 
                  onChange={handleChange} 
                  placeholder="Brief explanation for your resignation"
                />
              </div>
              
              <div className="rl-form-group">
                <label>Gratitude Message</label>
                <textarea 
                  name="gratitudeMessage" 
                  value={formData.gratitudeMessage} 
                  onChange={handleChange} 
                  placeholder="Express your gratitude"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResignationLetter;