using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace LifeBoat.Web.Hubs
{
	public class ChatHub : Hub
	{
		[Authorize]
		public Task Send(string message)
		{
			string name;
			var user = Context.User;
			if (user.Identity.IsAuthenticated)
			{
				name = user.Identity.Name;
			}
			else
			{
				name = "Anonymous";
			}

			return Clients.All.addNewMessageToPage(name, message);
		}
	}
}