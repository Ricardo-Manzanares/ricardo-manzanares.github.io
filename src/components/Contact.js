

import { useState } from 'react';
import {LeminCroppedCaptchaContainer, leminCroppedCaptcha} from "@leminnow/react-lemin-cropped-captcha";

const captchaContainerId = "portFolioCaptcha";
const captchaId = "CROPPED_23307d5_36d052294e1742878a95e6667305813a";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const captchaValue = leminCroppedCaptcha.getCaptcha(captchaId).getCaptchaValue();
        if (!captchaValue.answer || !captchaValue.challenge_id){
            // If captcha is not valid, proceed with form submission
            setSubmitStatus('errorCaptcha');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Trigger GitHub Actions workflow via repository dispatch
            const response = await fetch('https://contactportfolio-mfl6bakrea-ew.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    userRequest: formData.message
                })
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                console.error('GitHub API Response:', response.status, response.statusText);
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
                Contact <span className="text-blue-400">Me</span>
            </h2>
            <p className="text-center text-gray-400 mb-12">Get in touch, let's talk!</p>            
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-600 text-white rounded-md">
                        Thank you! Your message has been sent successfully.
                    </div>
                )}
                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
                        Sorry, there was an error sending your message. Please try again.
                    </div>
                )}
                 {submitStatus === 'errorCaptcha' && (
                    <div className="mb-6 p-4 bg-red-600 text-white rounded-md">
                        Sorry, there was an error with the captcha. Please try again.
                    </div>
                )}                
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                placeholder="Your Name" 
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                placeholder="Your Email" 
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                        <textarea 
                            id="message" 
                            rows="5" 
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            placeholder="Your Message"
                        ></textarea>
                    </div>
                    <div className="mt-6 text-dark">
                        <LeminCroppedCaptchaContainer containerId="portFolioCaptcha" captchaId="CROPPED_23307d5_36d052294e1742878a95e6667305813a"/>
                    </div>
                    <div className="mt-8 text-center">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105 disabled:transform-none"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contact;