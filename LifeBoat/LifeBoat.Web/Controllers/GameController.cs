using LifeBoat.Services.Interfaces;
using LifeBoat.Web.Hubs;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LifeBoat.Web.Controllers
{
    public class GameController : ApiController
    {
		private IMatchmaker _matchmaker;

		public GameController(IMatchmaker matchmaker)
		{
			_matchmaker = matchmaker;
		}

		[HttpGet]
		public int Join(string connectionId)
		{
			//TODO: Add user to game in database
			//TODO: Add user to game in hub
			//TODO: Return a response to the client saying he has joined.
			
			var userName = RequestContext.Principal.Identity.Name;
			
			var gameId = _matchmaker.FindAGameLookingForPlayers();
			var groupName = string.Format("game{0}", gameId);

			var gameHubContext = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
			gameHubContext.Groups.Add(connectionId, groupName);
			gameHubContext.Clients.Group(groupName).announceJoinedPlayer(userName);

			return gameId;
		}
	}
}
