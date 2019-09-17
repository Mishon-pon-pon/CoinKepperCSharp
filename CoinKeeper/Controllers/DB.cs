using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Runtime.Serialization.Json;
using Microsoft.AspNetCore.Http;
using System.Text;
using CoinKeeper.Models;

namespace CoinKeeper.Controllers
{
    class DB
    {
        public static SqlConnection DBConnection = new SqlConnection("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=CoinKeeper");
        public static SqlCommand Query(string queryString)
        {
            SqlCommand DBCommand = new SqlCommand(queryString, DBConnection);
            DBConnection.Open();
            return DBCommand;
        }
        public static int getRowsCount(string queryString)
        {
            SqlCommand getCountRows = DB.Query(queryString);
            int countRows = 0;
            using (SqlDataReader counter = getCountRows.ExecuteReader())
            {
                while (counter.Read())
                {
                    countRows = (int)counter["rowsCount"];
                }
            }
            DB.DBConnection.Close();
            return countRows;
        }
        public static void desirializeRBody<T> (ref T inst, HttpRequest requestHttp) where T : class
        {
            string json;
            using (var reader = new StreamReader(requestHttp.Body))
            {
                json = reader.ReadToEnd();
            }
            var ms = new MemoryStream(Encoding.UTF8.GetBytes(json));
            var ser = new DataContractJsonSerializer(inst.GetType());
            inst = ser.ReadObject(ms) as T;
        }
    }
}
