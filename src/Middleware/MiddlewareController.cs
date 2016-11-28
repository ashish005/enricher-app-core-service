using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Enricher.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.NodeServices;

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
                                    name= "A",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "B",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "c",
                                    method = "Delete",
                                    description = "aasfdfsdsfs"
                                },
                            },
                        name = "collection 1",
                        id = 12312312
                    },
                    new ApiCollection(){
                        apisList =  new List<ApiInfo>(){
                                new ApiInfo(){
                                    name= "A",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "B",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "c",
                                    method = "Delete",
                                    description = "aasfdfsdsfs"
                                },
                            },
                        name = "collection 1",
                        id = 12312312
                    },
                    new ApiCollection(){
                        apisList =  new List<ApiInfo>(){
                                new ApiInfo(){
                                    name= "A",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "B",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "c",
                                    method = "Delete",
                                    description = "aasfdfsdsfs"
                                },
                            },
                        name = "collection 1",
                        id = 12312312
                    },
                    new ApiCollection(){
                        apisList =  new List<ApiInfo>(){
                                new ApiInfo(){
                                    name= "A",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "B",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "c",
                                    method = "Delete",
                                    description = "aasfdfsdsfs"
                                },
                            },
                        name = "collection 1",
                        id = 12312312
                    },
                    new ApiCollection(){
                        apisList =  new List<ApiInfo>(){
                                new ApiInfo(){
                                    name= "A",
                                    method = "GET",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "B",
                                    method = "POST",
                                    description = "aasfdfsdsfs"
                                },
                                new ApiInfo(){
                                    name= "c",
                                    method = "Delete",
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
        public async Task<IActionResult> MyAction([FromServices] INodeServices nodeServices)
        {
            var result = await nodeServices.InvokeAsync<object>("./greeter", 1, 2);
            return Content(result.ToString(), "application/json");
        }

        // [HttpGet("{id}", Name = "GetTodo")]
        // public IEnumerable<object> GetById(string id)
        // {
        //    return this.MyAction();
        // }
    }
}
namespace Enricher.Models
{
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