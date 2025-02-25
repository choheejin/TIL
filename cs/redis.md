# 레디스

## 개념

### 레디스는 인메모리 데이터 저장소이다.

- Redis(Remote Dictionary Server)는 고속 데이터 처리를 위해 사용되는 인메모리 데이터 저장소이다.
- 일반적인 관계형 데이터베이스와 달리, 데이터를 디스크가 아닌 메모리에 저장하여 읽기/쓰기의 속도가 매우 빠르다.
    - 데이터베이스의 부하를 줄이고 응답속도를 높이기 위한 캐싱 솔루션으로 많이 사용된다.
    - 예를 들어, 자주 조회되는 데이터를 Redis에 저장해두면 애플리케이션이 데이터베이스를 매번 조회할 필요없이 즉시 가져올 수 있어 성능이 크게 향상된다.

### 레디스는 영속성 기능을 제공한다.

- 영속성 옵션을 제공하여, 단순한 캐시 역할 뿐만 아니라 데이터 저장소로도 활용할 수 있다.
- RDB(Redis Database)
    - 일정 시간마다 전체 데이터를 스냅샷으로 저장
    - 빠르게 복구 가능하지만, 마지막 저장 이후 변경된 데이터는 손실될 수 있음
- AOF(Append-Only File)
    - 모든 쓰기 명령을 로그에 기록하여 복구 가능
    - RDB 보다 복구 시간이 길지만, 데이터 손실이 거의 없음

### 레디스는 싱글 쓰레드이다.

- 1번에 1개의 명령어만 실행할 수 있어 한 서비스에서 요청된 명령어에 대한 작업이 끝나기 전까진 다른 서비스에서 요청하는 명령은 못 받아들인다.
- keys, flushall 명령어는 절대 사용하지 않도록 유의하자
    - 싱글 스레드이기 때문에, 모든 키를 다 가져오고, 모든 키를 삭제하는 명령어[O(N)]가 모두 실행되기 전까지 다른 요청에 대한 작업을 진행하지 못한다.
- 즉, Redis는 빠른 속도, 다양한 자료구조, 영속성 기능을 갖춘 고성능 데이터 저장소로 실시간 데이터 처리가 중요한 서비스 (소셜 네트워크, 실시간 채팅, 게임 순위 시스템) 등에서 널리 사용되고 있다.

### 레디스는 확장성이 뛰어나다.

- 데이터 양이 많아지거나, 트래픽이 급격히 증가하는 경우에 수평적 확장을 통해 성능을 최적화할 수 있다.
- Master-Slave Replication
    - 데이터 읽기 부하 분산을 위해 사용됨
    - Master: 데이터를 기록하는 주요 서버
    - Slave: 마스터 데이터를 복제하여 읽기 작업을 처리하는 보조 서버
    - Replication은 비동기적으로 동작하여 일부 데이터 손실 가능성 존재
- Redis Sentinel
    - 고가용성을 위해 Redis Sentinel을 활용할 수 있음
    - Master-Slave Replication을 관리하는 시스템
    - 클러스터의 상태를 모니터링하고, 장애 발생 시 자동 장애 복구 기능을 수행한다.
    - 마스터 노드에 장애가 발생하면, 센티널은 슬레이브 중 하나를 새로운 마스터로 선출한다. (Failover)
- Redis Cluster
    - Cluster Node: 데이터를 저장하고 처리하는 개별 Redis 인스턴스이다.
    - Slot: 데이터를 균등하게 분배하기 위해 전체 데이터베이스가 일정 개수의 슬롯으로 나뉜다.
    - 클러스터는 자동으로 데이터를 다중 노드에 분산하여 저장한다.
    - Sharding: 데이터를 여러노드로 분산하여 처리량 및 용량을 확장할 수 있다.

## 레디스 활용: 실시간 랭크 기반 랜덤 매칭 시스템

### 활용 이유

1. 초고속 데이터 처리가 가능하다.
2. 동시성 문제 해결이 가능하다.
3. Redis 자료 구조를 활용할 수 있다.
    1. Sorted Set 자료구조 활용 가능
4. 오래된 데이터를 자동으로 삭제가 가능하다.

### 고려 포인트 1. EventPublish, Redis의 Pub/Sub 무엇이 더 효율적인가

- EventPublish는 메모리에서 바로 처리하는 반면, Redis의 Pub/Sub는 네트워크의 통신을 필요로 하기 때문에 약간 느린 경향이 있다.
- EventPublish는 기본적으로 동기적으로 처리한다.
- 싱글 인스턴스 내에서만 이벤트를 처리한다면, Spring EventPublish가 더 간단하다.
- 하지만, 멀티서버 환경에서 이벤트를 공유해야한다면, Redis Pub/Sub가 더 적합하다.
    - Spring EventPublish → 내부 매칭 로직 진행
    - Redis Pub/Sub → 다른 서버에도 이벤트 전파

### 고려 포인트 2. @Scheduled가 굳이 필요할까?

- 현재 로직은 5분마다 deleteUsers() 메서드를 실행하여 만료된 사용자를 확인하고 있다.
    - 주기적인 폴링은 리소스 낭비이며 불필요한 부하를 준다.
    - 사용자가 적을 때도 동일한 주기로 실행되어 불필요한 연산이 발생한다.
- Redis Keyspace Notifications를 활용하여 로직 개선이 가능하다.
    - Redis의 만료된 키에 대한 알림을 수신하여 deleteUsers() 로직 실행 가능
    - 새로운 사용자 입장 및 키의 만료가 수신될 때만 로직 실행이 가능해진다.

### 고려 포인트 3. 많은 자료구조가 필요한 로직일까?

- 입장 순서, 점수 기반 정렬, 사용자 정보를 각각 다른 자료구조를 통해 저장하는 중이다. 해당 저장이 과연 필요한 정보일까?
    
    ```java
      // 유저 정보 저장
      redisTemplate.opsForHash().put(userInfoKey, userToken, waitingUser);
      // 입장 순서 큐에 추가
      redisTemplate.opsForList().rightPush(queueKey, userToken);
      // 스코어 정렬셋에 추가
      redisTemplate.opsForZSet().add(sortedKey, userToken, (double) rankScore);
      // 입장 시간 TTL 설정 (5분 만료)
      stringRedisTemplate.opsForValue().set(expireKey, "EXPIRED", Duration.ofMinutes(5));
    ```
    
- 입장 순서 큐가 굳이 필요가 없을 것 같음
    
    ```java
    List<Object> waitingUsers = redisTemplate.opsForList().range(queueKey, 0, -1);
    if (waitingUsers == null || waitingUsers.isEmpty()) continue;
    
    for(Object userToken : waitingUsers) {
        String expireKeyString = getUserJoinTimeKey(id, userToken.toString());
    
    ```
    
    - 현재의 코드를 보면, 모든 사용자 정보를 다 불러오는 것을 알 수 있다. 이는 keys 명령어와 유사하게 싱글 스레드인 Redis의 구조와 적합하지 않다.
    
    ```java
    Set<Object> candidates = redisTemplate.opsForZSet().rangeByScore(
            sortedSetKey, 
            rankScore - 100, 
            rankScore + 100);
    ```
    
    - 이 코드를 통해 후보군을 먼저 뽑은 후, 추가적으로 넣은 입장 시간을 고려한 코드를 추가 작성하여 최적화할 수 있을 것 같다.

> 추후 고친 코드 업로드 예정
