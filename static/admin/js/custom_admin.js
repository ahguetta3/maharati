// تحسينات لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات حركية للقوائم
    const menuItems = document.querySelectorAll('.module h2, .module caption');
    menuItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.transform = 'translateX(-5px)';
            this.style.transition = 'transform 0.3s';
        });
        item.addEventListener('mouseout', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // تحسين عرض الجداول
    const tables = document.querySelectorAll('#result_list');
    tables.forEach(table => {
        table.classList.add('responsive-table');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            row.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
            });
        });
    });

    // إضافة أزرار سريعة للتصفية
    const filterSection = document.querySelector('#changelist-filter');
    if (filterSection) {
        const quickFilters = document.createElement('div');
        quickFilters.className = 'quick-filters';
        quickFilters.innerHTML = `
            <h3>تصفية سريعة</h3>
            <button onclick="window.location.href='?created_at__gte=${new Date().toISOString().split('T')[0]}'">
                اليوم
            </button>
            <button onclick="window.location.href='?created_at__gte=${new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]}'">
                آخر أسبوع
            </button>
        `;
        filterSection.prepend(quickFilters);
    }

    // تحسين نموذج الإدخال
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach(row => {
        const input = row.querySelector('input[type="text"], input[type="number"], textarea');
        if (input) {
            input.addEventListener('focus', function() {
                row.style.backgroundColor = '#f8f9fa';
            });
            input.addEventListener('blur', function() {
                row.style.backgroundColor = '';
            });
        }
    });

    // إضافة زر العودة للأعلى
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '⬆';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
