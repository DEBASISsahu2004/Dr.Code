import React from 'react';
import { useState } from 'react';
import './form.css';

const Form = () => {
    const [formData, setFormData] = useState({
        email: '', name: '', phone: '', gender: '', age: '', city: '', membership: '',
        frequencyOfVisit: '', itemsInCart: '', numberOfOrders: '', totalSpend: '', averageRating: '',
        engagedWithEmails: '', usedDiscountCodes: '', daysSinceLastPurchase: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/getLeadScore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            setSubmitted(true);
        }
    };

    const backToForm = () => {
        setSubmitted(false);
        setFormData({
            email: '', name: '', phone: '', gender: '', age: '', city: '', membership: '',
            frequencyOfVisit: '', itemsInCart: '', numberOfOrders: '', totalSpend: '', averageRating: '',
            engagedWithEmails: '', usedDiscountCodes: '', daysSinceLastPurchase: '', enquirySource: ''
        });
    }

    return (
        <div className="form-container" >
            <h2 className="form-title">Lead Capture Form</h2>
            {submitted ? (
                <>
                    <p className="form-success-message">Thank you! Your information has been submitted.</p>
                    <button type="button" onClick={backToForm}>back to Form</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="form-grid">
                    <label>
                        Email Address
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Name
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Phone Number
                        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    </label>
                    <label>
                        Gender
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label>
                        Age
                        <input type="number" name="age" placeholder="Age" min="0" value={formData.age} onChange={handleChange} required />
                    </label>
                    <label>
                        City
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                    </label>
                    <label>
                        Membership
                        <select name="membership" value={formData.membership} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Basic">Basic</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                        </select>
                    </label>
                    <label>
                        Frequency of Visit
                        <input type="number" name="frequencyOfVisit" placeholder="Frequency of Visit" min="0" value={formData.frequencyOfVisit} onChange={handleChange} required />
                    </label>
                    <label>
                        Number of Items in Cart
                        <input type="number" name="itemsInCart" placeholder="Number of Items in Cart" min="0" value={formData.itemsInCart} onChange={handleChange} required />
                    </label>
                    <label>
                        Number of Orders
                        <input type="number" name="numberOfOrders" placeholder="Number of Orders" min="0" value={formData.numberOfOrders} onChange={handleChange} required />
                    </label>
                    <label>
                        Total Spend
                        <input type="number" name="totalSpend" placeholder="Total Spend" value={formData.totalSpend} min="0" onChange={handleChange} required />
                    </label>
                    <label>
                        Average Rating
                        <input type="number" name="averageRating" placeholder="Average Rating" value={formData.averageRating} onChange={handleChange} required min="1" max="5" />
                    </label>
                    <label>
                        Engaged with Emails?
                        <select name="engagedWithEmails" value={formData.engagedWithEmails} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                    <label>
                        Used Discount Codes?
                        <select name="usedDiscountCodes" value={formData.usedDiscountCodes} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                    <label>
                        Days Since Last Purchase
                        <input type="number" name="daysSinceLastPurchase" placeholder="Days Since Last Purchase" value={formData.daysSinceLastPurchase} onChange={handleChange} min="0" required />
                    </label>
                    <button type="submit" className="form-submit-button">Submit</button>
                </form>
            )}
        </div >
    )
}

export default Form