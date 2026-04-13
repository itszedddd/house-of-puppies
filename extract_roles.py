import xml.etree.ElementTree as ET
import zipfile
import os

def get_docx_text(path):
    """
    Extracts text from a docx file using zipfile and xml parsing.
    """
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespace
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            p_texts = []
            for p in tree.findall('.//w:p', ns):
                t_texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
                if t_texts:
                    p_texts.append("".join(t_texts))
            
            return "\n".join(p_texts)
    except Exception as e:
        return str(e)

docx_path = r'C:\Users\ender\Downloads\HOP-Thesis-Paper_00.docx'
full_text = get_docx_text(docx_path)

# Look for context diagram or role sections
keywords = ["Context Diagram", "Staff", "Administrator", "Veterinary", "Owner", "Access"]
findings = []

for kw in keywords:
    # Find sentences or paragraphs containing the keyword
    lines = full_text.split('\n')
    for i, line in enumerate(lines):
        if kw.lower() in line.lower():
            # Grab context (previous line, current, next)
            start = max(0, i-2)
            end = min(len(lines), i+3)
            findings.append(f"--- Context for '{kw}' ---")
            findings.extend(lines[start:end])
            findings.append("\n")

with open('extracted_thesis_roles.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(findings))
    f.write("\n\n--- FIRST 2000 CHARS ---\n")
    f.write(full_text[:2000])

print("Extraction done. View extracted_thesis_roles.txt")
