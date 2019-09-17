using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CoinKeeper.Models;
using System.Data.SqlClient;

namespace CoinKeeper.Controllers
{
    public class sumController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult isNew()
        {
            Sum sum = new Sum();
            DB.desirializeRBody(ref sum, Request);
            SqlCommand write = DB.Query(
                "Insert into [Sum]([Value], createDate, CategoryId) " +
                "Values('" + sum.Value + "', GETDATE(), '" + sum.CategoryId + "');");
            write.ExecuteNonQuery();
            DB.DBConnection.Close();

            Sum newSum = new Sum();
            SqlCommand read = DB.Query("Select TOP 1 * FROM [Sum] ORDER BY SumId DESC");
            using (SqlDataReader reader = read.ExecuteReader())
            {
                while (reader.Read())
                {
                    newSum = new Sum((int)reader["SumId"], (int)reader["Value"], (DateTime)reader["createDate"], (int)reader["CategoryId"]);

                }
            }
            DB.DBConnection.Close();
            return Json(newSum);
        }
    }
}