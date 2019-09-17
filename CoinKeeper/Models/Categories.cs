using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoinKeeper.Models
{
    public class Categories
    {
        public int categoryId { get; set; }
        public string name { get; set; }
        public int accountId { get; set; }
        public int value { get; set; }
        public Categories(int _categoryId, string _name, int _accountId, int _value)
        {
            categoryId = _categoryId;
            name = _name;
            accountId = _accountId;
            value = _value;
        }
        public Categories(int _categoryId, string _name, int _accountId)
        {
            categoryId = _categoryId;
            name = _name;
            accountId = _accountId;
        }
        public Categories() { }
    }
}
