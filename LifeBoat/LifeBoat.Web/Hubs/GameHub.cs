using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using LifeBoat.Services.Interfaces;
using LifeBoat.Services;

namespace LifeBoat.Web.Hubs
{
	public class GameHub : Hub
	{
		private readonly IMatchmaker _matchmaker;

		public GameHub()
		{
			_matchmaker = new Matchmaker(); //TODO: Use dependency injection here
		}

		[Authorize]
		public Task SendChat(string message)
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

			return Clients.All.receiveChat(name, message);
		}

		[Authorize]
		public async Task Join()
		{
			var userName = Context.User.Identity.Name;

			var gameId = _matchmaker.FindAGameLookingForPlayers();
			var groupName = string.Format("game{0}", gameId);

			var gameHubContext = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
			await gameHubContext.Groups.Add(Context.ConnectionId, groupName);
			gameHubContext.Clients.Group(groupName).announceJoinedPlayer(userName);
		}
	}
}