using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WordSet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WordSetController : ControllerBase
    {
        private readonly ILogger<WordSetController> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly Dictionary<string, string> listToFile = new Dictionary<string, string>() 
        {
            { "NGSL", "ngsl_1.01.txt" },
            { "NAWL", "nawl_1.0.txt" }
        };

        public WordSetController(ILogger<WordSetController> logger, IWebHostEnvironment _environment)
        {
            _logger = logger;
            this._environment = _environment;
        }

        [HttpGet("{calculationId}")]
        public async Task<IEnumerable<string>> GetAsync(string calculationId)
        {
            var fileName = string.Format("{0}.txt", calculationId);
            string path = Path.Combine(_environment.WebRootPath, "Results", fileName);
            return await ReadFirstWord(path);
        }

        public class CalculateResponse
        {
            public string Id { get; set; }
        }

        [HttpPost]
        public async Task<CalculateResponse> PostAsync(List<IFormFile> srcFiles, List<IFormFile> diffFiles, IFormCollection data)
        {
            var set = new HashSet<string>();
            var srcLists = data["srcLists"];
            foreach(var srcList in srcLists)
            {
                set.UnionWith(await ReadFirstWord(Path.Combine("lists", listToFile[srcList])));
            }

            //var diffSet = new HashSet<string>();
            foreach (var formFile in diffFiles)
            {
                set.ExceptWith(await ReadFirstWordAsync(formFile.OpenReadStream()));
            }
            //var resultSet = set.Except(diffSet);
            //save file

            var calculationId = DateTime.Now.Ticks;
            var resultsPath = Path.Combine(_environment.WebRootPath, "Results", $@"{calculationId}.txt");
            using var writer = new StreamWriter(resultsPath);
            foreach (string word in set)
            {
                writer.WriteLine(word);
            }

            return new CalculateResponse() { Id = calculationId.ToString() };
        }

        private async Task<ISet<string>> ReadFirstWordAsync(Stream stream)
        {
            var set = new HashSet<string>();
            using (var reader = new StreamReader(stream))
            {
                while (reader.Peek() >= 0)
                {
                    var line = await reader.ReadLineAsync();
                    set.Add(line.Split(null, 2).First());
                }
            }
            return set;
        }

        private Task<ISet<string>> ReadFirstWord(string listPath)
        {
            return ReadFirstWordAsync(System.IO.File.OpenRead(listPath));
        }
    }
}
