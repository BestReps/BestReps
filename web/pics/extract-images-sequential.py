import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import shutil
from pathlib import Path

def extract_images_from_html_files(html_file_paths, output_folder='extracted_images'):
    """
    Extracts all images from multiple HTML files in sequence and saves them to the specified folder.
    
    Args:
        html_file_paths (list): List of paths to HTML files in the desired order
        output_folder (str): Folder where images will be saved
    
    Returns:
        list: Paths to saved images
    """
    # Create output directory if it doesn't exist
    Path(output_folder).mkdir(exist_ok=True)
    
    saved_images = []
    image_counter = 0
    
    for html_index, html_file_path in enumerate(html_file_paths):
        print(f"\nProcessing file {html_index + 1}/{len(html_file_paths)}: {html_file_path}")
        
        # Read the HTML file
        with open(html_file_path, 'r', encoding='utf-8', errors='ignore') as file:
            html_content = file.read()
        
        # Parse HTML content
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Get base URL for relative paths (if any)
        base_url = None
        base_tag = soup.find('base')
        if base_tag and 'href' in base_tag.attrs:
            base_url = base_tag['href']
        
        # Get the directory of the HTML file to resolve relative paths
        html_dir = os.path.dirname(os.path.abspath(html_file_path))
        
        # Find all img tags
        img_tags = soup.find_all('img')
        print(f"Found {len(img_tags)} image tags in file {os.path.basename(html_file_path)}")
        
        for img in img_tags:
            img_url = img.get('src')
            if not img_url:
                continue
            
            try:
                # Handle different types of image paths
                if img_url.startswith('data:image'):
                    # Skip data URIs for now
                    print(f"Skipping data URI image: {img_url[:30]}...")
                    continue
                
                # Convert relative URL to absolute if needed
                if base_url and not img_url.startswith(('http://', 'https://', '/')):
                    img_url = urljoin(base_url, img_url)
                
                # Handle local file paths
                if not img_url.startswith(('http://', 'https://')):
                    img_path = os.path.join(html_dir, img_url.lstrip('/'))
                    
                    if os.path.exists(img_path):
                        # Local file exists, copy it
                        file_ext = os.path.splitext(img_path)[1] or '.jpg'
                        file_name = f"image_{image_counter:03d}{file_ext}"
                        output_path = os.path.join(output_folder, file_name)
                        shutil.copy2(img_path, output_path)
                        print(f"Copied local image: {img_path} -> {output_path}")
                        saved_images.append(output_path)
                        image_counter += 1
                    else:
                        print(f"Local image not found: {img_path}")
                else:
                    # Remote URL, download it
                    response = requests.get(img_url, stream=True)
                    if response.status_code == 200:
                        # Determine file extension
                        content_type = response.headers.get('content-type', '').split('/')
                        ext = '.jpg'  # Default extension
                        if len(content_type) > 1:
                            if content_type[1] == 'jpeg':
                                ext = '.jpg'
                            elif content_type[1] in ['png', 'gif', 'webp', 'svg+xml']:
                                ext = '.' + content_type[1].replace('svg+xml', 'svg')
                        
                        file_name = f"image_{image_counter:03d}{ext}"
                        output_path = os.path.join(output_folder, file_name)
                        
                        with open(output_path, 'wb') as out_file:
                            shutil.copyfileobj(response.raw, out_file)
                        print(f"Downloaded image: {img_url} -> {output_path}")
                        saved_images.append(output_path)
                        image_counter += 1
                    else:
                        print(f"Failed to download image: {img_url} (Status code: {response.status_code})")
            except Exception as e:
                print(f"Error processing image {img_url}: {str(e)}")
    
    print(f"\nSuccessfully saved {len(saved_images)} images to {output_folder}")
    return saved_images

if __name__ == "__main__":
    # Define the paths to the HTML files
    base_dir = os.path.join(os.path.expanduser("~"), "Desktop", "BestReps", "web", "pics")
    html_files = [
        os.path.join(base_dir, "spreadsheet 1.html"),
        os.path.join(base_dir, "spreadsheet 2.html")
    ]
    
    output_folder = "extracted_images"
    print(f"\nProcessing {len(html_files)} HTML files in sequence:")
    for i, file in enumerate(html_files):
        print(f"{i+1}. {file}")
    
    extract_images_from_html_files(html_files, output_folder)
