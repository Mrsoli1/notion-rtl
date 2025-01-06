// تابع برای تشخیص جهت متن (RTL یا LTR)
function detectDirection(text) {
    return /[\u0600-\u06FF]/.test(text) ? "rtl" : "ltr";
}

// تابع برای اعمال جهت به فرزندان بر اساس جهت والد
function applyDirectionToChildren(parentElement) {
    const direction = getComputedStyle(parentElement).direction;
    const children = parentElement.querySelectorAll("*");
    children.forEach(child => {
        child.style.direction = direction;
    });
}

// تابع برای تعیین جهت کل لیست بر اساس وجود متن RTL
function setListDirection(listElement) {
    const items = listElement.querySelectorAll("li");
    let hasRTL = false;

    items.forEach(item => {
        if (/[\u0600-\u06FF]/.test(item.textContent)) {
            hasRTL = true;
        }
    });

    listElement.style.direction = hasRTL ? "rtl" : "ltr";
}

// تابع برای تنظیم جهت بلوک متنی
function setBlockDirection(blockElement) {
    const direction = detectDirection(blockElement.textContent);
    blockElement.style.direction = direction;
}

// نظارت بر تغییرات در صفحه و اعمال تنظیمات جهت
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    setBlockDirection(node);
                    applyDirectionToChildren(node);
                    if (node.tagName === 'UL' || node.tagName === 'OL') {
                        setListDirection(node);
                    }
                }
            });
        } else if (mutation.type === 'characterData') {
            const parentElement = mutation.target.parentElement;
            setBlockDirection(parentElement);
            applyDirectionToChildren(parentElement);
        }
    }
});

// شروع نظارت بر تغییرات در محتوای صفحه
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

// اعمال تنظیمات جهت به عناصر موجود در صفحه در بارگذاری اولیه
document.querySelectorAll(".notion-page-content, ul, ol").forEach(block => {
    setBlockDirection(block);
    applyDirectionToChildren(block);
    if (block.tagName === 'UL' || block.tagName === 'OL') {
        setListDirection(block);
    }
});
