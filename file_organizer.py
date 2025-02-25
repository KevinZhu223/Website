import os
import shutil
from datetime import datetime
import re
from pathlib import Path

class FileOrganizer:
    def __init__(self, directory):
        self.directory = directory
        self.categories = {
            'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
            'documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv'],
            'audio': ['.mp3', '.wav', '.flac', '.m4a'],
            'video': ['.mp4', '.avi', '.mkv', '.mov'],
            'archives': ['.zip', '.rar', '.7z', '.tar', '.gz']
        }
        
        self.patterns = {
            'invoice': r'invoice|receipt|bill',
            'screenshot': r'screenshot|screen\s?shot',
            'backup': r'backup|bak'
        }

    def create_folders(self):
        """Create category folders if they don't exist"""
        for category in self.categories.keys():
            folder_path = os.path.join(self.directory, category)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

    def get_category_by_extension(self, file_extension):
        """Determine category based on file extension"""
        for category, extensions in self.categories.items():
            if file_extension.lower() in extensions:
                return category
        return None

    def get_category_by_name(self, filename):
        """Determine category based on filename patterns"""
        for category, pattern in self.patterns.items():
            if re.search(pattern, filename.lower()):
                return category
        return None

    def create_misc_folder(self):
        """Create a misc folder with timestamp"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        misc_folder = os.path.join(self.directory, f'misc_{timestamp}')
        os.makedirs(misc_folder)
        return misc_folder

    def organize(self):
        """Main function to organize files"""
        self.create_folders()
        
        # Get all files in directory
        files = [f for f in os.listdir(self.directory) 
                if os.path.isfile(os.path.join(self.directory, f))]
        
        misc_folder = None
        
        for file in files:
            if file == os.path.basename(__file__):  # Skip the script itself
                continue
                
            file_path = os.path.join(self.directory, file)
            file_extension = os.path.splitext(file)[1]
            
            # Try to categorize by extension
            category = self.get_category_by_extension(file_extension)
            
            # If no category found, try by name
            if not category:
                category = self.get_category_by_name(file)
            
            # If still no category, move to misc
            if not category:
                if not misc_folder:
                    misc_folder = self.create_misc_folder()
                target_folder = misc_folder
            else:
                target_folder = os.path.join(self.directory, category)
            
            # Move the file
            try:
                shutil.move(file_path, os.path.join(target_folder, file))
                print(f"Moved {file} to {target_folder}")
            except Exception as e:
                print(f"Error moving {file}: {str(e)}")

if __name__ == "__main__":
    # Use the downloads folder as default
    downloads_path = str(Path.home() / "Downloads")
    organizer = FileOrganizer(downloads_path)
    organizer.organize() 