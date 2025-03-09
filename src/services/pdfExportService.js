import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateChartImageForPdf } from './chartService';

export async function generatePdf(reportType, data, dateRange) {
  const doc = new jsPDF();
  
  // Tambahkan metadata
  doc.setProperties({
    title: `Laporan ${reportType}`,
    subject: `Periode: ${dateRange.startDate} sampai ${dateRange.endDate}`,
    author: 'Sistem Laporan',
    keywords: 'laporan, bisnis, keuangan',
    creator: 'Aplikasi Laporan'
  });
  
  // Menambahkan header dengan branding
  addHeader(doc, reportType, dateRange);
  
  // Tambahkan grafik jika jenis laporan mendukung
  if (['sales', 'income-expense', 'products'].includes(reportType)) {
    try {
      // Generate chart image
      const chartImage = await generateChartImageForPdf(data, reportType, 600, 300);
      
      // Tambahkan grafik ke dokumen
      doc.addImage(chartImage, 'PNG', 20, 40, 170, 85);
      
      // Atur Y position untuk konten selanjutnya
      const startY = 135; // Posisi Y setelah grafik
      
      // Menambahkan konten berdasarkan jenis laporan
      switch(reportType) {
        case 'sales':
          addSalesReport(doc, data, startY);
          break;
        case 'income-expense':
          addIncomeExpenseReport(doc, data, startY);
          break;
        case 'products':
          addProductsReport(doc, data, startY);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Error generating chart:", err);
      // Fallback: tampilkan data tanpa grafik
      switch(reportType) {
        case 'sales':
          addSalesReport(doc, data);
          break;
        case 'income-expense':
          addIncomeExpenseReport(doc, data);
          break;
        case 'products':
          addProductsReport(doc, data);
          break;
        default:
          doc.text('Tidak ada data yang tersedia', 14, 40);
      }
    }
  } else {
    // Untuk jenis laporan tanpa grafik, gunakan implementasi yang ada
    switch(reportType) {
      case 'transactions':
        addTransactionsReport(doc, data);
        break;
      case 'customers':
        addCustomersReport(doc, data);
        break;
      default:
        doc.text('Tidak ada data yang tersedia', 14, 40);
    }
  }
  
  // Tambahkan watermark jika diinginkan (optional)
  // addWatermark(doc, 'CONFIDENTIAL');
  
  // Tambahkan styling profesional
  addProfessionalStyle(doc);
  
  // Menambahkan footer dengan nomor halaman
  addFooter(doc);
  
  return doc.output('blob');
}

// Lanjutan fungsi untuk membuat tampilan yang lebih profesional
function addProfessionalStyle(doc) {
  // Tambahkan border pada halaman
  const totalPages = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Border halus di sekitar halaman
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Garis header
    doc.setDrawColor(66, 139, 202);
    doc.setLineWidth(1);
    doc.line(10, 32, pageWidth - 10, 32);
    
    // Garis footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  }
}

function addHeader(doc, reportType, dateRange) {
  // Logo perusahaan (opsional)
  // doc.addImage(logoData, 'PNG', 14, 10, 30, 15);
  
  // Judul laporan
  const titles = {
    'sales': 'LAPORAN PENJUALAN',
    'transactions': 'LAPORAN TRANSAKSI',
    'customers': 'LAPORAN PELANGGAN',
    'products': 'LAPORAN PRODUK',
    'income-expense': 'LAPORAN PEMASUKAN DAN PENGELUARAN'
  };
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(titles[reportType] || 'LAPORAN', 105, 20, { align: 'center' });
  
  // Periode laporan
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periode: ${dateRange.startDate} sampai ${dateRange.endDate}`, 105, 28, { align: 'center' });
  
  // Garis pembatas
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);
}

function addFooter(doc) {
  const totalPages = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Halaman ${i} dari ${totalPages}`, 105, 287, { align: 'center' });
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 287);
  }
}

function addSalesReport(doc, data, startY = 40) {
  // Ringkasan penjualan
  if (data.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Ringkasan Penjualan', 14, startY);
    
    // Kotak ringkasan dengan warna
    doc.setFillColor(240, 248, 255);
    doc.rect(14, startY + 5, 180, 25, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const col1 = 20;
    const col2 = 90;
    const col3 = 160;
    
    doc.text(`Total Penjualan:`, col1, startY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(data.summary.totalSales)}`, col1, startY + 22);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Jumlah Transaksi:`, col2, startY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.summary.transactionCount}`, col2, startY + 22);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Rata-rata:`, col3, startY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatCurrency(data.summary.averageTransaction)}`, col3, startY + 22);
  }
  
  // Tabel data penjualan - gunakan warna yang menarik
  const tableHeaders = [['Tanggal', 'Invoice', 'Pelanggan', 'Total', 'Metode Pembayaran']];
  
  const tableData = data.data.map(item => [
    formatDate(item.date),
    item.invoiceNumber,
    item.customerName,
    formatCurrency(item.total),
    item.paymentMethod
  ]);
  
  doc.autoTable({
    startY: startY + (data.summary ? 40 : 10),
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    margin: { top: 10 },
    didDrawPage: function(data) {
      // Header pada halaman kedua dst
      if (data.pageCount > 1) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Laporan Penjualan (lanjutan)`, 14, 10);
      }
    }
  });
}
// Implementasi fungsi untuk jenis laporan lainnya
function addTransactionsReport(doc, data) {
  // Implementasi untuk laporan transaksi
  const tableHeaders = [['Tanggal', 'Invoice', 'Pelanggan', 'Item', 'Qty', 'Harga', 'Total']];
  
  const tableData = data.data.map(item => [
    formatDate(item.date),
    item.invoiceNumber,
    item.customerName,
    item.productName,
    item.quantity,
    formatCurrency(item.price),
    formatCurrency(item.total)
  ]);
  
  doc.autoTable({
    startY: 40,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
}

function formatCustomerData(data) {
  if (data.data.length <= 5) {
    return data.data.map(customer => {
      return {
        ...customer,
        formattedTotal: formatCurrency(customer.totalPurchase),
        formattedAverage: formatCurrency(customer.average),
        lastPurchase: customer.lastPurchaseDate || 'N/A',
        notes: customer.notes || ''
      };
    });
  }
  
  return data.data.map(customer => ({
    ...customer,
    formattedTotal: formatCurrency(customer.totalPurchase),
    formattedAverage: formatCurrency(customer.average)
  }));
}

function paginateData(doc, data, itemsPerPage, renderFunction) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  for (let i = 0; i < totalPages; i++) {
    if (i > 0) {
      doc.addPage();
    }
    
    const pageData = data.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
    renderFunction(doc, pageData, i);
  }
}

function addExecutiveSummary(doc, data, reportType) {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Eksekutif', 14, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 50;
  const bulletPoint = '• ';
  
  switch (reportType) {
    case 'sales':
      if (data.summary) {
        const trends = analyzeSalesTrends(data.data);
        
        doc.text(`${bulletPoint}Total penjualan periode ini: ${formatCurrency(data.summary.totalSales)}`, 20, yPos);
        yPos += 8;
        
        doc.text(`${bulletPoint}Jumlah transaksi: ${data.summary.transactionCount} transaksi`, 20, yPos);
        yPos += 8;
        
        doc.text(`${bulletPoint}Rata-rata per transaksi: ${formatCurrency(data.summary.averageTransaction)}`, 20, yPos);
        yPos += 8;
        
        if (trends.highestDay) {
          doc.text(`${bulletPoint}Hari dengan penjualan tertinggi: ${trends.highestDay.date} (${formatCurrency(trends.highestDay.total)})`, 20, yPos);
          yPos += 8;
        }
        
        if (trends.lowestDay) {
          doc.text(`${bulletPoint}Hari dengan penjualan terendah: ${trends.lowestDay.date} (${formatCurrency(trends.lowestDay.total)})`, 20, yPos);
          yPos += 8;
        }
      }
      break;
      
    case 'income-expense':
      const reportData = data.data[0] || data[0];
      
      doc.text(`${bulletPoint}Total pemasukan: ${formatCurrency(reportData.totalIncome)}`, 20, yPos);
      yPos += 8;
      
      doc.text(`${bulletPoint}Total pengeluaran: ${formatCurrency(reportData.totalExpense)}`, 20, yPos);
      yPos += 8;
      
      doc.text(`${bulletPoint}Pendapatan bersih: ${formatCurrency(reportData.netIncome)}`, 20, yPos);
      yPos += 8;
      
      const status = parseFloat(reportData.netIncome) >= 0 ? 'UNTUNG' : 'RUGI';
      doc.setFont('helvetica', 'bold');
      doc.text(`${bulletPoint}Status keuangan: ${status}`, 20, yPos);
      doc.setFont('helvetica', 'normal');
      
      break;
      
    case 'products':
      if (data.data && data.data.length > 0) {
        const sortedByQuantity = [...data.data].sort((a, b) => b.quantitySold - a.quantitySold);
        const sortedByRevenue = [...data.data].sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
        
        if (sortedByQuantity[0]) {
          doc.text(`${bulletPoint}Produk terlaris: ${sortedByQuantity[0].name} (${sortedByQuantity[0].quantitySold} unit)`, 20, yPos);
          yPos += 8;
        }
        
        if (sortedByRevenue[0]) {
          doc.text(`${bulletPoint}Produk dengan pendapatan tertinggi: ${sortedByRevenue[0].name} (${formatCurrency(sortedByRevenue[0].revenue)})`, 20, yPos);
          yPos += 8;
        }
        
        const totalSold = data.data.reduce((sum, item) => sum + parseInt(item.quantitySold), 0);
        const totalRevenue = data.data.reduce((sum, item) => sum + parseFloat(item.revenue), 0);
        
        doc.text(`${bulletPoint}Total unit terjual: ${totalSold} unit`, 20, yPos);
        yPos += 8;
        
        doc.text(`${bulletPoint}Total pendapatan produk: ${formatCurrency(totalRevenue)}`, 20, yPos);
      }
      break;
  }
  
  return yPos + 15;
}

function analyzeSalesTrends(salesData) {
  if (!salesData || salesData.length === 0) return {};
  
  let highest = { total: 0 };
  let lowest = { total: Infinity };
  
  const sortedData = [...salesData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const salesByDate = {};
  sortedData.forEach(sale => {
    if (!salesByDate[sale.date]) {
      salesByDate[sale.date] = 0;
    }
    salesByDate[sale.date] += parseFloat(sale.total);
  });
  
  Object.entries(salesByDate).forEach(([date, total]) => {
    if (total > highest.total) {
      highest = { date, total };
    }
    if (total < lowest.total) {
      lowest = { date, total };
    }
  });
  
  return {
    highestDay: highest.total > 0 ? highest : null,
    lowestDay: lowest.total < Infinity ? lowest : null
  };
}

function addCustomersReport(doc, data) {
  const formattedData = formatCustomerData(data);
  const tableHeaders = [['Nama', 'Kontak', 'Total Pembelian', 'Frekuensi', 'Rata-rata']];
  
  const tableData = formattedData.map(item => [
    item.name,
    item.contact,
    item.formattedTotal,
    item.frequency,
    item.formattedAverage
  ]);
  
  const startY = addExecutiveSummary(doc, data, 'customers');
  
  paginateData(doc, tableData, 20, (doc, pageData, pageIndex) => {
    doc.autoTable({
      startY: pageIndex === 0 ? startY : 40,
      head: tableHeaders,
      body: pageData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: function(data) {
        if (data.pageCount > 1) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.text(`Laporan Pelanggan (lanjutan)`, 14, 10);
        }
      }
    });
  });
}
function addProductsReport(doc, data) {
  // Implementasi untuk laporan produk
  const tableHeaders = [['Kode', 'Nama Produk', 'Kategori', 'Total Terjual', 'Pendapatan']];
  
  const tableData = data.data.map(item => [
    item.code,
    item.name,
    item.category,
    item.quantitySold,
    formatCurrency(item.revenue)
  ]);
  
  doc.autoTable({
    startY: 40,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
}

function addIncomeExpenseReport(doc, data) {
  const reportData = data.data[0] || data[0];
  
  // Ringkasan pemasukan-pengeluaran
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Keuangan', 14, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Kotak ringkasan dengan warna
  // Pemasukan (kotak hijau)
  doc.setFillColor(230, 247, 230);
  doc.rect(14, 45, 55, 20, 'F');
  doc.setTextColor(0, 100, 0);
  doc.text('Total Pemasukan:', 17, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(reportData.totalIncome), 17, 60);
  
  // Pengeluaran (kotak merah)
  doc.setTextColor(0);
  doc.setFillColor(252, 235, 235);
  doc.rect(75, 45, 55, 20, 'F');
  doc.setTextColor(150, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Pengeluaran:', 78, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(reportData.totalExpense), 78, 60);
  
  // Pendapatan bersih
  const isPositive = parseFloat(reportData.netIncome) >= 0;
  doc.setFillColor(isPositive ? 230, 247, 230 : 252, 235, 235);
  doc.rect(136, 45, 55, 20, 'F');
  doc.setTextColor(isPositive ? 0, 100, 0 : 150, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Pendapatan Bersih:', 139, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(reportData.netIncome), 139, 60);
  
  // Reset warna teks
  doc.setTextColor(0);
  
  // Tabel Pemasukan
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detail Pemasukan', 14, 75);
  
  if (reportData.incomeTransactions && reportData.incomeTransactions.length > 0) {
    const incomeHeaders = [['Tanggal', 'Deskripsi', 'Jumlah']];
    const incomeData = reportData.incomeTransactions.map(item => [
      item.date,
      item.description,
      formatCurrency(item.amount)
    ]);
    
    doc.autoTable({
      startY: 80,
      head: incomeHeaders,
      body: incomeData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 167, 69], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 255, 240] }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Tidak ada data pemasukan untuk periode ini.', 14, 85);
  }
  
  // Ambil posisi Y terkini setelah tabel pemasukan
  let yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
  
  // Tabel Pengeluaran
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detail Pengeluaran', 14, yPos);
  
  if (reportData.expenseTransactions && reportData.expenseTransactions.length > 0) {
    const expenseHeaders = [['Tanggal', 'Deskripsi', 'Jumlah']];
    const expenseData = reportData.expenseTransactions.map(item => [
      item.date,
      item.description,
      formatCurrency(item.amount)
    ]);
    
    // Jika tabel pengeluaran akan melewati halaman, tambahkan halaman baru
    if (yPos + 10 > 270) {
      doc.addPage();
      yPos = 20;
      doc.text('Detail Pengeluaran', 14, yPos);
    }
    
    doc.autoTable({
      startY: yPos + 5,
      head: expenseHeaders,
      body: expenseData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [220, 53, 69], textColor: 255 },
      alternateRowStyles: { fillColor: [255, 240, 240] }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Tidak ada data pengeluaran untuk periode ini.', 14, yPos + 10);
  }
}