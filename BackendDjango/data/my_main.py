with open('../initial_data.json', 'rb') as f:
    content = f.read()

# Thử decode thử nghiệm
try:
    text = content.decode('utf-16')  # hoặc utf-8-sig
except UnicodeDecodeError:
    text = content.decode('utf-8', errors='ignore')  # fallback

with open('../fixed_data.json', 'w', encoding='utf-8') as f:
    f.write(text)