# Logo Customization Guide

This guide explains how to customize the logo for your Fashion Store application.

## Adding Your Custom Logo

1. **Prepare your logo image:**
   - File name: `logo.png`
   - Recommended dimensions: 120-150px width × 40-50px height
   - Format: PNG (transparent background recommended for best results)
   - The logo will be displayed at a fixed height of 40px in the header

2. **Place the logo file:**
   - Copy your `logo.png` file to the `public/` directory in the project root
   - Path: `public/logo.png`

3. **Automatic integration:**
   - The logo will automatically appear in the header navigation bar
   - The logo will also be used as the browser favicon/tab icon
   - If no `logo.png` file is found, the application will display "FASHION STORE" as text

## Visual Example

The logo appears in the top-left corner of the header:

![Logo in Header](https://github.com/user-attachments/assets/8a4d45c8-4aa2-498a-8da9-e11c434ff55d)

## Technical Details

- The logo is loaded from `/logo.png` (which resolves to `public/logo.png` in Vite)
- The Header component includes automatic fallback to text if the image fails to load
- The same logo is used as the favicon in the browser tab
- No code changes are required - just add the `logo.png` file

## Troubleshooting

**Logo not appearing?**
- Verify the file is named exactly `logo.png` (lowercase)
- Verify the file is in the `public/` directory
- Clear your browser cache and refresh the page
- Check browser console for any image loading errors

**Logo size issues?**
- The logo height is fixed at 40px (10 Tailwind units)
- Width scales proportionally
- For best results, use a logo with aspect ratio suitable for header display
