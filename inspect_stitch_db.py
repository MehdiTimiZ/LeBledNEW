import sqlite3
import os

dbs = [
    r"C:\Users\I589654\.stitch-mcp\config\access_tokens.db",
    r"C:\Users\I589654\.stitch-mcp\config\credentials.db",
    r"C:\Users\I589654\.stitch-mcp\config\default_configs.db"
]

for db_path in dbs:
    print(f"--- Checking {db_path} ---")
    if not os.path.exists(db_path):
        print("File not found.")
        continue
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"Tables: {tables}")
        for table_name in tables:
            t = table_name[0]
            print(f"Content of table {t}:")
            try:
                cursor.execute(f"SELECT * FROM {t} LIMIT 5")
                rows = cursor.fetchall()
                for row in rows:
                    print(row)
            except Exception as e:
                print(f"Error reading table {t}: {e}")
        conn.close()
    except Exception as e:
        print(f"Error connecting to {db_path}: {e}")
