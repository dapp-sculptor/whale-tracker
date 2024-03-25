# Whale Tracker Backend API

**Server Origin Url:** [http://45.61.162.38:9000](http://45.61.162.38:9000)

## API List

### Ping
- **Method:** GET
- **Endpoint:** `{server_origin_url}/api/tokens`
- **Return:** Endpoint status

### Get Pair
- **Method:** GET
- **Endpoint:** `{server_origin_url}/api/tokens/pair`
- **Params:**
  - `baseToken`: string
    - *require:* valid solana address
  - `quoteToken`: string
    - *require:* valid solana address
- **Return:** PairsList

### Get Top Holders List
- **Method:** GET
- **Endpoint:** `{server_origin_url}/api/tokens/topholders`
- **Params:**
  - `tokenMint`: string
    - *require:* valid solana address
- **Return:** Top Holders List

### Get Top Traders List
- **Method:** GET
- **Endpoint:** `{server_origin_url}/api/tokens/toptraders`
- **Params:**
  - `pair`: string
    - *require:* valid solana address
- **Return:** Top Traders List
