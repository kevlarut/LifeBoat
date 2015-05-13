namespace LifeBoat.Web.Models
{
	using System;
	using System.Collections.Generic;
	using System.ComponentModel.DataAnnotations.Schema;
	using System.Data.Entity;
	using System.Linq;

	public class GameModels : DbContext
	{
		// Your context has been configured to use a 'GameModels' connection string from your application's 
		// configuration file (App.config or Web.config). By default, this connection string targets the 
		// 'LifeBoat.Web.Models.GameModels' database on your LocalDb instance. 
		// 
		// If you wish to target a different database and/or database provider, modify the 'GameModels' 
		// connection string in the application configuration file.
		public GameModels()
			: base("name=GameModels")
		{
		}

		// Add a DbSet for each entity type that you want to include in your model. For more information 
		// on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.

		public virtual DbSet<Game> Games { get; set; }
	}

	public class Player
	{
		public int PlayerId { get; set; }
		public string ClientId { get; set; }
		
		[ForeignKey("GameId")]
		public virtual Game Game { get; set; }
	}

	public class Game
	{
		public int GameId { get; set; }

		public virtual ICollection<Player> Players { get; set; }
	}
}