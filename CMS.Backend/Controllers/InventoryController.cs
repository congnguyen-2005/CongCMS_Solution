using CMS.data;
using CMS.data.Entities;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class InventoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================================
        // 1. GIAO DIỆN DASHBOARD TỒN KHO
        // ========================================================
        public IActionResult Index()
        {
            var inventoryData = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderBy(p => p.StockQuantity) // Xếp những món sắp hết hàng lên đầu
                .ToList();

            return View(inventoryData);
        }

        // ========================================================
        // 2. XUẤT FILE EXCEL BÁO CÁO TỒN KHO
        // ========================================================
        public IActionResult ExportExcel()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderBy(p => p.CategoryProductId)
                .ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("BaoCaoTonKho");
                var currentRow = 1;

                // Tiêu đề các cột
                worksheet.Cell(currentRow, 1).Value = "Mã SP";
                worksheet.Cell(currentRow, 2).Value = "Tên Thiết Bị";
                worksheet.Cell(currentRow, 3).Value = "Danh Mục";
                worksheet.Cell(currentRow, 4).Value = "Giá Bán";
                worksheet.Cell(currentRow, 5).Value = "Tồn Thực Tế";
                worksheet.Cell(currentRow, 6).Value = "Trạng Thái Kho";

                // Định dạng dòng tiêu đề (In đậm, nền xám)
                worksheet.Range("A1:F1").Style.Font.Bold = true;
                worksheet.Range("A1:F1").Style.Fill.BackgroundColor = XLColor.LightGray;

                // Đổ dữ liệu vào file
                foreach (var item in products)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = item.Id;
                    worksheet.Cell(currentRow, 2).Value = item.Name;
                    worksheet.Cell(currentRow, 3).Value = item.CategoryProduct?.Name ?? "Chưa phân loại";
                    worksheet.Cell(currentRow, 4).Value = item.Price;
                    worksheet.Cell(currentRow, 4).Style.NumberFormat.Format = "#,##0 ₫";
                    worksheet.Cell(currentRow, 5).Value = item.StockQuantity;

                    // Xử lý logic cảnh báo trong Excel
                    string status = "Còn hàng";
                    if (item.StockQuantity == 0) status = "HẾT HÀNG";
                    else if (item.StockQuantity <= 2) status = "Sắp hết (Cảnh báo)"; // Safety Stock

                    worksheet.Cell(currentRow, 6).Value = status;
                }

                // Tự động căn chỉnh độ rộng các cột
                worksheet.Columns().AdjustToContents();

                // Trả file về cho trình duyệt tải xuống
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    string fileName = $"BaoCaoKho_CameraClick_{DateTime.Now:ddMMyyyy}.xlsx";
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }
    }
}