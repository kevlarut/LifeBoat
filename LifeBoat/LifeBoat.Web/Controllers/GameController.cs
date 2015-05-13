using LifeBoat.Services.Interfaces;
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
		public int Join()
		{
			var gameId = _matchmaker.FindAGameLookingForPlayers();
			//TODO: Add user to game in database
			//TODO: Add user to game in hub
			//TODO: Return a response to the client saying he has joined.
			return gameId;
		}
	}
}
