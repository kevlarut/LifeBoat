using LifeBoat.Services.Interfaces;


namespace LifeBoat.Services
{
	public class Matchmaker : IMatchmaker
	{
		public int FindAGameLookingForPlayers()
		{
			return 1; //TODO: Get this from the database instead.  If there are no open games, create one.
		}
	}
}
