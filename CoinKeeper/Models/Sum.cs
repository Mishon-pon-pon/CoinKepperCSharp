using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoinKeeper.Models
{
    public class Sum
    {
        public int SumId { get; set; }
        public int Value { get; set; }
        public DateTime createDate { get; set; }
        public int CategoryId { get; set; }
        public Sum(int _SumId, int _Value, DateTime _createDate, int _CategoryId)
        {
            SumId = _SumId;
            Value = _Value;
            createDate = _createDate;
            CategoryId = _CategoryId;
        }
        public Sum() { }
    }
}
