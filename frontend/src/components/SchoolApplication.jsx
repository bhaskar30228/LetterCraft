import React, { useRef, useState } from 'react';
import './SchoolApplication.css';
import html2pdf from 'html2pdf.js';

const SchoolApplication = () => {
  const letterRef = useRef(null);
  const [formData, setFormData] = useState({
    studentName: '',
    studentGrade: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    principalName: 'Principal',
    schoolName: '',
    currentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    applicationType: 'Admission',
    programName: '',
    academicYear: '',
    studentAchievements: '',
    reasonForApplication: '',
    yourClosing: 'Yours sincerely,'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
    const element = letterRef.current;
    const clonedElement = element.cloneNode(true);
    clonedElement.style.width = '210mm';
    clonedElement.style.padding = '20mm';
    document.body.appendChild(clonedElement);

    const opt = {
      margin: 1,
      filename: `school-application-${formData.studentName || 'application'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3,
        useCORS: true,
        windowHeight: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
        ignoreElements: (el) => el.classList?.contains('sa-no-print')
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
      a.download = `School-Application-${formData.studentName || 'Application'}.pdf`;
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
      const file = new File([blob], `school-application-${formData.studentName}.pdf`, { type: blob.type });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `School Application for ${formData.studentName}`,
          text: `Please find attached the school application letter.`,
        });
      } else {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Please find attached the school application letter.`)}`;
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
    <div className="sa-app">
      <div className="sa-controls sa-no-print">
        <h2>School Application Letter</h2>
        <div className="sa-button-group">
          <button className="sa-edit-btn" onClick={toggleEditing}>
            {isEditing ? 'Close' : 'Edit '}
          </button>
          <button className="sa-print-btn" onClick={() => window.print()}>
            Print
          </button>
          <button 
            className="sa-download-btn" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download '}
          </button>
          <button 
            className="sa-whatsapp-btn" 
            onClick={handleShareToWhatsApp}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </button>
        </div>
      </div>

      <div className={`sa-container ${isEditing ? 'sa-with-editor' : ''}`}>
        <div className="sa-template" ref={letterRef}>
          <header className="sa-header">
            <div className="sa-sender-info">
              <div className="sa-school-header">
                <h1 className="sa-school-name">{formData.schoolName || 'School Name'}</h1>
                <p className="sa-school-motto">Knowledge • Integrity • Excellence</p>
              </div>
              <div className="sa-student-info">
                <h2 className="sa-student-name">{formData.studentName || 'Student Name'}</h2>
                <p className="sa-contact-info">
                  Grade: {formData.studentGrade || 'Grade'} • 
                  Parent: {formData.parentName || 'Parent Name'} • 
                  {formData.parentEmail || ' parent@email.com'} • 
                  {formData.parentPhone || ' (123) 456-7890'}
                </p>
              </div>
            </div>
            <div className="sa-logo-placeholder">
              <div className="sa-logo-circle">
                <div className="sa-logo-inner">S</div>
              </div>
            </div>
          </header>

          <div className="sa-content">
            <div className="sa-date">{formData.currentDate}</div>
            
            <div className="sa-recipient-info">
              <p>The Principal</p>
              <p>{formData.schoolName || 'School Name'}</p>
              <p>Subject: Application for {formData.applicationType || 'Admission'}</p>
            </div>
            
            <div className="sa-salutation">Respected {formData.principalName || 'Principal'},</div>
            
            <div className="sa-body">
              <p className="sa-opening-paragraph">
                I am writing to formally apply for {formData.applicationType || 'admission'} to your esteemed institution 
                for the {formData.academicYear || 'academic year'} in {formData.programName || 'the program'}.
              </p>
              
              <p>
                My child, {formData.studentName || 'Student Name'}, currently in {formData.studentGrade || 'Grade'}, 
                has demonstrated {formData.studentAchievements || 'notable achievements in academics and extracurricular activities'}.
              </p>
              
              <p>
                {formData.reasonForApplication || 'The reason for this application is [brief explanation].'} 
                We believe your institution's values and educational approach align perfectly with our expectations.
              </p>
              
              <p className="sa-closing-paragraph">
                I have attached all required documents with this application. I would be grateful for the opportunity 
                to discuss this application further at your earliest convenience.
              </p>
            </div>
            
            <div className="sa-sign-off">
              <p>{formData.yourClosing}</p>
              <div className="sa-signature-line"></div>
              <p className="sa-parent-name">{formData.parentName || 'Parent Name'}</p>
              <p className="sa-relation">Parent/Guardian of {formData.studentName || 'Student Name'}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="sa-editor-panel">
            <h3>Customize Your Application</h3>
            <div className="sa-form-grid">
              <div className="sa-form-group">
                <label>Student's Full Name</label>
                <input 
                  type="text" 
                  name="studentName" 
                  value={formData.studentName} 
                  onChange={handleChange} 
                  placeholder="Student Name"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Current Grade/Class</label>
                <input 
                  type="text" 
                  name="studentGrade" 
                  value={formData.studentGrade} 
                  onChange={handleChange} 
                  placeholder="Grade 5"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Parent's Name</label>
                <input 
                  type="text" 
                  name="parentName" 
                  value={formData.parentName} 
                  onChange={handleChange} 
                  placeholder="Parent Name"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Parent's Email</label>
                <input 
                  type="email" 
                  name="parentEmail" 
                  value={formData.parentEmail} 
                  onChange={handleChange} 
                  placeholder="parent@email.com"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Parent's Phone</label>
                <input 
                  type="tel" 
                  name="parentPhone" 
                  value={formData.parentPhone} 
                  onChange={handleChange} 
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Principal's Name</label>
                <input 
                  type="text" 
                  name="principalName" 
                  value={formData.principalName} 
                  onChange={handleChange} 
                  placeholder="Principal's Name"
                />
              </div>
              
              <div className="sa-form-group">
                <label>School Name</label>
                <input 
                  type="text" 
                  name="schoolName" 
                  value={formData.schoolName} 
                  onChange={handleChange} 
                  placeholder="School Name"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Application Type</label>
                <select 
                  name="applicationType" 
                  value={formData.applicationType} 
                  onChange={handleChange}
                >
                  <option value="Admission">Admission</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="sa-form-group">
                <label>Program Name</label>
                <input 
                  type="text" 
                  name="programName" 
                  value={formData.programName} 
                  onChange={handleChange} 
                  placeholder="e.g., Elementary Program"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Academic Year</label>
                <input 
                  type="text" 
                  name="academicYear" 
                  value={formData.academicYear} 
                  onChange={handleChange} 
                  placeholder="2023-2024"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Student's Achievements</label>
                <textarea 
                  name="studentAchievements" 
                  value={formData.studentAchievements} 
                  onChange={handleChange} 
                  placeholder="Brief description of student's achievements"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Reason for Application</label>
                <textarea 
                  name="reasonForApplication" 
                  value={formData.reasonForApplication} 
                  onChange={handleChange} 
                  placeholder="Why you're applying to this school"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolApplication;