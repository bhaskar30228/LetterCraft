import React, { useRef, useState } from 'react';
import './JobCoverLetter.css';
import html2pdf from 'html2pdf.js';

const LeaveApplicationJob = () => {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    yourName: '',
    yourPosition: '',
    yourDepartment: '',
    yourEmail: '',
    yourPhone: '',
    managerName: '',
    companyName: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    totalDays: '',
    reason: '',
    yourClosing: 'Sincerely,'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, totalDays: diffDays.toString() }));
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
      filename: `leave-application-${formData.yourName || 'application'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        windowHeight: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        ignoreElements: (el) => el.classList?.contains('no-print')
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
      a.download = `Leave-Application-${formData.yourName || 'Application'}.pdf`;
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
      const file = new File([blob], `leave-application-${formData.yourName}.pdf`, { type: blob.type });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Leave Application from ${formData.yourName}`,
          text: `Please find attached my leave application.`,
        });
      } else {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Please find attached my leave application.`)}`;
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
    <div className="job-cover-letter-app">
      <div className="letter-controls no-print">
        <h2>Leave Application</h2>
        <div className="button-group">
          <button className="edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`job-cover-letter-container ${isEditing ? 'with-editor' : ''}`}>
        <div className="cover-letter-template" ref={letterRef}>
          <header className="letter-header">
            <div className="sender-info">
              <h1 className="your-name">{formData.yourName || 'Your Name'}</h1>
              <p className="contact-info">
                {formData.yourPosition || 'Your Position'} • 
                {formData.yourDepartment || 'Your Department'} • 
                {formData.yourEmail || ' your@email.com'} • 
                {formData.yourPhone || ' (123) 456-7890'}
              </p>
            </div>
            <div className="logo-placeholder">
              <div className="logo-circle"></div>
            </div>
          </header>

          <div className="letter-content">
            <div className="date">{formData.currentDate}</div>
            
            <div className="recipient-info">
              <p>{formData.managerName || 'Manager Name'}</p>
              <p>{formData.companyName || 'Company Name'}</p>
            </div>
            
            <div className="salutation">Dear {formData.managerName || 'Manager'},</div>
            
            <div className="letter-body">
              <p className="opening-paragraph">
                I am writing to formally request a {formData.leaveType || 'type of leave'} leave 
                from {formData.startDate || 'start date'} to {formData.endDate || 'end date'} 
                (total of {formData.totalDays || 'number of'} days).
              </p>
              
              <p>
                The reason for my leave is {formData.reason || 'your reason for leave'}. 
                I have made arrangements to ensure my responsibilities are covered during my absence.
              </p>
              
              <p>
                Please let me know if you require any additional information or documentation 
                regarding my leave request. I would be happy to provide whatever is needed.
              </p>
              
              <p className="closing-paragraph">
                Thank you for considering my request. I look forward to your approval and 
                will ensure a smooth transition before my leave begins.
              </p>
            </div>
            
            <div className="sign-off">
              <p>{formData.yourClosing}</p>
              <div className="signature-line"></div>
              <p className="your-name">{formData.yourName || 'Your Name'}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="editor-panel">
            <h3>Customize Your Leave Application</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Your Full Name</label>
                <input 
                  type="text" 
                  name="yourName" 
                  value={formData.yourName} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label>Your Position</label>
                <input 
                  type="text" 
                  name="yourPosition" 
                  value={formData.yourPosition} 
                  onChange={handleChange} 
                  placeholder="Software Engineer"
                />
              </div>
              
              <div className="form-group">
                <label>Your Department</label>
                <input 
                  type="text" 
                  name="yourDepartment" 
                  value={formData.yourDepartment} 
                  onChange={handleChange} 
                  placeholder="IT Department"
                />
              </div>
              
              <div className="form-group">
                <label>Your Email</label>
                <input 
                  type="email" 
                  name="yourEmail" 
                  value={formData.yourEmail} 
                  onChange={handleChange} 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Your Phone</label>
                <input 
                  type="tel" 
                  name="yourPhone" 
                  value={formData.yourPhone} 
                  onChange={handleChange} 
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="form-group">
                <label>Manager Name</label>
                <input 
                  type="text" 
                  name="managerName" 
                  value={formData.managerName} 
                  onChange={handleChange} 
                  placeholder="Ms. Jane Smith"
                />
              </div>
              
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  placeholder="Acme Inc."
                />
              </div>
              
              <div className="form-group">
                <label>Leave Type</label>
                <select 
                  name="leaveType" 
                  value={formData.leaveType} 
                  onChange={handleChange}
                >
                  <option value="Annual">Annual</option>
                  <option value="Sick">Sick</option>
                  <option value="Personal">Personal</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Paternity">Paternity</option>
                  <option value="Bereavement">Bereavement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  onBlur={calculateDays}
                />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  onBlur={calculateDays}
                />
              </div>
              
              <div className="form-group">
                <label>Total Days</label>
                <input 
                  type="text" 
                  name="totalDays" 
                  value={formData.totalDays} 
                  onChange={handleChange} 
                  readOnly
                />
              </div>
              
              <div className="form-group">
                <label>Reason for Leave</label>
                <textarea 
                  name="reason" 
                  value={formData.reason} 
                  onChange={handleChange} 
                  placeholder="Please specify the reason for your leave"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplicationJob;