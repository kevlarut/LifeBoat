using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LifeBoat.Web.Startup))]
namespace LifeBoat.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
			app.MapSignalR();
        }
    }
}
