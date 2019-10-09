using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using CoinKeeper.Models;
using System.IO;
using System.Web;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

namespace CoinKeeper.Controllers
{
    public class categoryController : Controller
    {

        public JsonResult exist()
        {
            SqlCommand data = DB.Query("SELECT "
                                            + "case "
                                            + "when sum(s.Value) is null "
                                            + "then 0 else sum(s.Value) "
                                            + "end as [Value], c.CategoryId, c.AccountId, c.[Name] "
                                            + "FROM Categories c "
                                            + "left join[Sum] s on c.CategoryId = s.CategoryId "
                                            + "GROUP BY c.CategoryId, c.AccountId, c.[Name]");
            List<Categories> rows = new List<Categories>();

            using (SqlDataReader reader = data.ExecuteReader())
            {


                while (reader.Read())
                {
                    rows.Add(new Categories((int)reader["CategoryId"], (string)reader["Name"], (int)reader["AccountId"], (int)reader["Value"]));
                }
            }
            DB.DBConnection.Close();
            return Json(rows);
        }
        [HttpPost]
        public JsonResult Isnew()
        {
            var deserializedCat = new Categories();
            DB.desirializeRBody(ref deserializedCat, Request);
            SqlCommand write = DB.Query("Insert into Categories([Name], AccountId) Values('" + deserializedCat.name + "', 1);");
            write.ExecuteNonQuery();
            DB.DBConnection.Close();

            int countRow = DB.getRowsCount("Select count(*) as rowsCount from Categories");
            SqlCommand data = DB.Query("Select *, 0 as Value FROM Categories");
            Categories res = new Categories();
            using (SqlDataReader reader = data.ExecuteReader())
            {
                while (reader.Read())
                {
                    res = new Categories((int)reader["CategoryId"], (string)reader["Name"], (int)reader["AccountId"], (int)reader["Value"]);
                }
            }
            DB.DBConnection.Close();
            return Json(res);
        }

        [HttpDelete]
        public String delete()
        {
            Regex reg = new Regex(@"\d*$");
            MatchCollection matches = reg.Matches(HttpContext.Request.Path.Value);
            string id = (string)matches[0].Value;
            SqlCommand delete = DB.Query("DELETE FROM Categories WHERE CategoryId = " + id);
            delete.ExecuteNonQuery();
            DB.DBConnection.Close();
            return id;
        }
    }

}