using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Enricher.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.NodeServices;
using Newtonsoft.Json;

namespace Enricher.Middleware
{

    public class MiddlewareController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }

    [Route("middlelayer/apis")]
    public class middlewareController : Controller
    {
        [HttpGet]
        public List<ApiCollection> GetAll()
        {
             ApisCollections obj = new ApisCollections(){
                apiColl = new List<ApiCollection>(){
                    new ApiCollection(){
                        apisList =  new List<ApiInfo>(){
                                new ApiInfo(){
                                    id= 17,
                                    name= "api1",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    id= 18,
                                    name= "B",
                                    method = "PUT",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    id= 19,
                                    name= "c",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                            },
                        name = "collection 1",
                        id = 12312312
                    }
                }
            };
            return obj.apiColl;
        }
        [HttpGet("{id}", Name = "GetTodo")]
        public async Task<JsonResult> MyAction(string id, [FromServices] INodeServices nodeServices)
        {
            var queryStrings = Request.Query;
            string config = "pg://postgres:password@123@127.0.0.1:5432/postgres";
            DBConfigModel model = new DBConfigModel() { 
                type = "pg", 
                config = config,
                query = string.Format("SELECT * FROM public.apisrepository {0}", (string.IsNullOrEmpty(id))? string.Empty:"where id = " + id)
            };

            ResponseObj result = await nodeServices.InvokeAsync<ResponseObj>("./NodeApp/db-config-main", "GET", model);
            return Json(result);
        }
    }
}
namespace Enricher.Models
{
     public class ResponseObj  {
        public object fields;
         public object rows;

     }
     public class DBConfigModel  {
         public string type;
         public string config;
         public string query;

     }
    public class ApisCollections  
        {  
            public List<ApiCollection>  apiColl {   get;   set;  }
        }  
        public class ApiCollection  
        {  
            public List<ApiInfo>  apisList {   get;   set;  }
            public string name  {   get;   set;  }  
            public string description  {   get;   set;  }  
            public int id  {   get;   set;  } 
        }  

        public class ApiInfo  
        {  
            public string method  {   get;   set;  } 
            public string name  {   get;   set;  }  
            public string description  {   get;   set;  }  
            public int id  {   get;   set;  } 
        } 
    }