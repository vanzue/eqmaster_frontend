import os
import re

# Define the root directory of your project
project_root = './test'

# Define the static folder containing PNG files
static_folder = os.path.join(project_root, 'static')

# Function to get all .png files in the static folder


def get_all_png_files(static_folder):
    png_files = []
    for root, _, files in os.walk(static_folder):
        for file in files:
            if file.lower().endswith('.png'):
                file_path = os.path.relpath(
                    os.path.join(root, file), project_root)
                png_files.append(os.path.normpath(file_path)
                                 )  # Normalize file path
    return png_files

# Function to search for references to PNG files in the project


def get_referenced_files(project_root):
    referenced_files = set()
    png_pattern = re.compile(r'/static/[\w\s/.-]+\.png', re.IGNORECASE)

    for root, _, files in os.walk(project_root):
        for file in files:
            # Add more file types if needed
            if file.endswith(('.js', '.vue', '.html', '.css', '.json', '.md')):
                with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    matches = png_pattern.findall(content)
                    for match in matches:
                        normalized_match = os.path.normpath(
                            match)  # Normalize file path
                        normalized_match = normalized_match[1:]
                        referenced_files.add(normalized_match)
    return referenced_files

# Function to remove unreferenced PNG files


def remove_unreferenced_files(static_folder, unreferenced_files):
    for file in unreferenced_files:
        file_path = os.path.join(project_root, file)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f'Removed: {file_path}')


# Get all PNG files in the static folder
all_png_files = get_all_png_files(static_folder)

# Get all referenced PNG files in the project
referenced_files = get_referenced_files(project_root)

# Identify unreferenced PNG files
unreferenced_files = [
    file for file in all_png_files if file not in referenced_files]

# Remove the unreferenced PNG files
remove_unreferenced_files(static_folder, unreferenced_files)

print("Cleanup completed.")
