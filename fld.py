from pathlib import Path

# 1. Setup paths
current_dir = Path('.') # Current directory
gitignore_path = current_dir / '.gitignore'

# 2. Find folders containing a hyphen
folders_to_ignore = [f.name for f in current_dir.iterdir() if f.is_dir() and '-' in f.name]

if folders_to_ignore:
    # 3. Open .gitignore in append mode
    with gitignore_path.open('a') as f:
        f.write("\n# Auto-generated: Folders with hyphens\n")
        for folder in folders_to_ignore:
            f.write(f"{folder}/\n")
    
    print(f"Successfully added {len(folders_to_ignore)} folders to .gitignore.")
else:
    print("No folders with '-' were found.")