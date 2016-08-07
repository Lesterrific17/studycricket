using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebMatrix.Data;
using System.Web.Helpers;
using Config;

namespace StudyCricket {

    public class Questions {

        public static IEnumerable<dynamic> GetQuestions() {

            var db = Database.Open(Config.DatabaseInfo.DatabaseName);
            var Query = "SELECT * FROM combos";
            var result = db.Query(Query);
            db.Close();
            return result;
        }

        public static IEnumerable<dynamic> GetSets(){
            var db = Database.Open(Config.DatabaseInfo.DatabaseName);
            var Query = "SELECT * FROM sets";
            var result = db.Query(Query);
            db.Close();
            return result;
        }

        public static int QuestionCount(int setId){
            var db = Database.Open(Config.DatabaseInfo.DatabaseName);
            var Query = "SELECT COUNT(*) as count FROM combos WHERE setId = @0";
            var result = db.QuerySingle(Query, setId);
            db.Close();
            return result.count;
        }

        public static IEnumerable<dynamic> GetQuestionsOfSet(int setId, bool forJson){
            var db = Database.Open(Config.DatabaseInfo.DatabaseName);
            var Query = "";
            if(forJson == false){
                Query = "SELECT * FROM combos WHERE setId = @0";
            }
            else{
                Query = "SELECT question, answer FROM combos WHERE setId = @0";
            }
            
            var result = db.Query(Query, setId);
            db.Close();
            return result;
        }

        public static void SaveSet(string title, string data){
            var db = Database.Open(Config.DatabaseInfo.DatabaseName);
            var Query = "DECLARE @SetId BIGINT"
                        + " INSERT INTO sets (name, description)"
                        + " VALUES (@0, '')"
                        + " SELECT SCOPE_IDENTITY() AS setId";

            var result = db.QuerySingle(Query, title);
            var combos = Json.Decode(data);

            foreach(var c in combos){
                Query = "INSERT INTO combos (question, answer, setId) VALUES (@0, @1, @2)";
                db.Execute(Query, c.question, c.answer, result.setId);
            }

            db.Close();
            return;
        }

    }

}

