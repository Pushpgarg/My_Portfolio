#!/usr/bin/env python3
"""
Portfolio Update Helper Script
This script helps you update your portfolio with information from your resume.
"""

import os
import re

def update_html_file(file_path, updates):
    """Update HTML file with new information"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Apply updates
        for old_text, new_text in updates.items():
            content = content.replace(old_text, new_text)
        
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        
        print(f"✅ Successfully updated {file_path}")
        return True
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def main():
    """Main function to guide user through portfolio updates"""
    print("🎯 Portfolio Update Helper")
    print("=" * 50)
    print("This script will help you update your portfolio with your actual information.")
    print("Please have your resume information ready.\n")
    
    # Get user information
    print("📝 Please provide the following information:")
    
    # Personal Information
    name = input("Full Name (default: Pushp Garg): ").strip() or "Pushp Garg"
    title = input("Title/Position (e.g., Computer Science Student): ").strip()
    location = input("Location (e.g., Singapore): ").strip()
    email = input("Email address: ").strip()
    phone = input("Phone number: ").strip()
    linkedin = input("LinkedIn URL: ").strip()
    github = input("GitHub URL: ").strip()
    
    # Education
    degree = input("Current Degree (e.g., Bachelor of Engineering in Computer Science): ").strip()
    institution = input("Institution (default: Nanyang Technological University): ").strip() or "Nanyang Technological University"
    education_duration = input("Education Duration (e.g., 2023 - 2027): ").strip()
    
    # Skills
    programming_languages = input("Programming Languages (comma-separated): ").strip()
    web_technologies = input("Web Technologies (comma-separated): ").strip()
    tools_technologies = input("Tools & Technologies (comma-separated): ").strip()
    
    # Personal Description
    personal_description = input("Personal Description (2-3 sentences about yourself): ").strip()
    
    print("\n🔄 Updating portfolio...")
    
    # Define updates
    updates = {
        # Personal Information
        "Student | Developer": title or "Student | Developer",
        "pushp.garg@example.com": email or "pushp.garg@example.com",
        "+65 1234 5678": phone or "+65 1234 5678",
        "Singapore": location or "Singapore",
        
        # Education
        "Bachelor of Technology (B.Tech)": degree or "Bachelor of Technology (B.Tech)",
        "Nanyang Technological University (NTU)": institution,
        "2023 - Present": education_duration or "2023 - Present",
        
        # Personal Description
        "I am a dedicated student with a passion for technology and innovation. My journey in computer science has been driven by curiosity and a desire to solve real-world problems through technology.": personal_description or "I am a dedicated student with a passion for technology and innovation. My journey in computer science has been driven by curiosity and a desire to solve real-world problems through technology.",
        
        # Contact Links
        'href="#"': f'href="{linkedin}"' if linkedin else 'href="#"',
        'href="#"': f'href="{github}"' if github else 'href="#"',
    }
    
    # Update HTML file
    if update_html_file('index.html', updates):
        print("\n✅ Portfolio updated successfully!")
        print("\n📋 Next steps:")
        print("1. Open index.html in your browser to review changes")
        print("2. Update the projects section with your actual projects")
        print("3. Update the achievements section with your accomplishments")
        print("4. Update the personal statement with your own words")
        print("5. Test the website on different devices")
        print("6. Deploy to GitHub Pages or your preferred hosting platform")
    else:
        print("\n❌ Failed to update portfolio. Please check the error messages above.")

if __name__ == "__main__":
    main()
