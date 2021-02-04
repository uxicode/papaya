<template>
  <!-- start: join -->
  <div class="join">
    <div class="contents">
      <div class="contents-inner">
        <div class="all-form">
          <h2 class="main-tit">{{ pageTitle }}</h2>

          <div class="form-progress">
            <ul class="progress-list clearfix">
              <li v-for="idx in stepTotal" :key="idx" class="item" :class="{'active':step===idx}"></li>
            </ul>
          </div>

          <div class="form-wrapper">
            <h3 class="form-sub-tit ct">{{ currentTitle }}</h3>
            <div class="form-cnt">
              <div class="accordion">
                <div class="accordion-tit form-tit">
                  <div class="btn-checkbox">
                    <input type="checkbox" id="allCheck">
                    <label for="allCheck">전체 동의</label>
                  </div>
                </div>
                <div v-for="item in terms_list" :key="item.idx">
                  <!-- accordion -->
                  <div class="accordion-tit form-tit">
                    <div class="btn-checkbox">
                      <input type="checkbox" :id="'check'+item.idx"  @click.native="check($event, item.type )">
                      <label :for="'check'+item.idx">{{ item.tit }}</label>
                    </div>

                    <!-- accordion-cnt가 active일 경우 accordion-btn도 active -->
                    <button class="accordion-btn" @click="accordionToggle(item)" :class="{ 'active': item.isActive }" data-toggle="collapse" :data-target="'#accordion'+item.idx"></button>
                  </div>
                  <!-- class="active" 일 경우 open -->
                  <div class="accordion-cnt" :class="{ 'active': item.isActive }" :id="'accordion'+item.idx">
                    <div class="agreement" v-html="item.desc"></div>
                  </div>
                  <!-- //accordion -->
                </div>
              </div>
            </div>
            <div class="form-btm">
              <div class="btn-group rt">
                <button type="button" class="btn basic x40 sm primary navi" disabled>다음</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- //end: join -->
</template>

<script>
export default {
  name: 'termsCheck',
  data() {
    return {
      pageTitle:'일반 회원가입',
      step:1,
      stepTotal:3,
      terms_list: [
        {
          idx: 1,
          tit: '서비스 이용약관(필수)',
          isActive: false,
          desc: `<p>제 1 조 (목적)</p>
                    <ul>
                      <li>1. 본 약관은 기업마당 사이트가 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 기업마당 사이트의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</li>
                    </ul>
                    <p>제 2 조 (약관의 효력과 변경)</p>
                    <ul>
                      <li>1. 기업마당 사이트는 귀하가 본 약관 내용에 동의하는 경우 기업마당 사이트의 서비스 제공 행위 및 귀하의 서비스 사용 행위에 본 약관이 우선적으로 적용됩니다.</li>
                      <li>2. 기업마당 사이트는 본 약관을 사전 고지 없이 변경할 수 있고 변경된 약관은 기업마당 사이트 내에 공지하거나 e-mail을 통해 회원에게 공지하며, 공지와 동시에 그 효력이 발생됩니다.<br>
                        이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 본인의 회원등록을 취소 (회원탈락)할 수 있으며 계속 사용의 경우는 약관 변경에 대한 동의로 간주 됩니다.</li>
                    </ul>
                    <p>제 3 조 (약관 외 준칙)</p>
                    <ul>
                      <li>1. 본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신윤리위원회심의규정, 정보통신 윤리강령, 프로그램보호법 및 기타 관련 법령의 규정에 의합니다.</li>
                    </ul>
                    <p>제 4 조 (용어의 정의) <br>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                    <ul>
                      <li>1. 이용자 : 본 약관에 따라 기업마당 사이트가 제공하는 서비스를 받는 자.</li>
                      <li>2. 가입 : 기업마당 사이트가 제공하는 신청서 양식에 해당 정보를 기입하고, 본 약관에 동의하여 서비스 이용계약을 완료시키는 행위.</li>
                      <li>3. 회원 : 기업마당 사이트에 개인 정보를 제공하여 회원 등록을 한 자로서 기업마당 사이트가 제공하는 서비스를 이용할 수 있는 자.</li>
                      <li>4. 비밀번호 : 이용자와 회원ID가 일치하는지를 확인하고 통신상의 자신의 비밀보호를 위하여 이용자 자신이 선정한 문자와 숫자의 조합.</li>
                      <li>5. 탈퇴 : 회원이 이용계약을 종료시키는 행위.</li>
                    </ul>`,
        },
        {
          idx: 2,
          tit: '개인정보 처리방침(필수)',
          isActive: false,
          desc: `<p>제 1 조 (목적)</p>
                    <ul>
                      <li>1. 본 약관은 기업마당 사이트가 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 기업마당 사이트의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</li>
                    </ul>
                    <p>제 2 조 (약관의 효력과 변경)</p>
                    <ul>
                      <li>1. 기업마당 사이트는 귀하가 본 약관 내용에 동의하는 경우 기업마당 사이트의 서비스 제공 행위 및 귀하의 서비스 사용 행위에 본 약관이 우선적으로 적용됩니다.</li>
                      <li>2. 기업마당 사이트는 본 약관을 사전 고지 없이 변경할 수 있고 변경된 약관은 기업마당 사이트 내에 공지하거나 e-mail을 통해 회원에게 공지하며, 공지와 동시에 그 효력이 발생됩니다.<br>
                        이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 본인의 회원등록을 취소 (회원탈락)할 수 있으며 계속 사용의 경우는 약관 변경에 대한 동의로 간주 됩니다.</li>
                    </ul>
                    <p>제 3 조 (약관 외 준칙)</p>
                    <ul>
                      <li>1. 본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신윤리위원회심의규정, 정보통신 윤리강령, 프로그램보호법 및 기타 관련 법령의 규정에 의합니다.</li>
                    </ul>
                    <p>제 4 조 (용어의 정의) <br>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                    <ul>
                      <li>1. 이용자 : 본 약관에 따라 기업마당 사이트가 제공하는 서비스를 받는 자.</li>
                      <li>2. 가입 : 기업마당 사이트가 제공하는 신청서 양식에 해당 정보를 기입하고, 본 약관에 동의하여 서비스 이용계약을 완료시키는 행위.</li>
                      <li>3. 회원 : 기업마당 사이트에 개인 정보를 제공하여 회원 등록을 한 자로서 기업마당 사이트가 제공하는 서비스를 이용할 수 있는 자.</li>
                      <li>4. 비밀번호 : 이용자와 회원ID가 일치하는지를 확인하고 통신상의 자신의 비밀보호를 위하여 이용자 자신이 선정한 문자와 숫자의 조합.</li>
                      <li>5. 탈퇴 : 회원이 이용계약을 종료시키는 행위.</li>
                    </ul>`,
        },
        {
          idx: 3,
          tit: '마케팅 정보 수집 동의(선택)',
          isActive: false,
          desc: `<p>제 1 조 (목적)</p>
                    <ul>
                      <li>1. 본 약관은 기업마당 사이트가 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 기업마당 사이트의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</li>
                    </ul>
                    <p>제 2 조 (약관의 효력과 변경)</p>
                    <ul>
                      <li>1. 기업마당 사이트는 귀하가 본 약관 내용에 동의하는 경우 기업마당 사이트의 서비스 제공 행위 및 귀하의 서비스 사용 행위에 본 약관이 우선적으로 적용됩니다.</li>
                      <li>2. 기업마당 사이트는 본 약관을 사전 고지 없이 변경할 수 있고 변경된 약관은 기업마당 사이트 내에 공지하거나 e-mail을 통해 회원에게 공지하며, 공지와 동시에 그 효력이 발생됩니다.<br>
                        이용자가 변경된 약관에 동의하지 않는 경우, 이용자는 본인의 회원등록을 취소 (회원탈락)할 수 있으며 계속 사용의 경우는 약관 변경에 대한 동의로 간주 됩니다.</li>
                    </ul>
                    <p>제 3 조 (약관 외 준칙)</p>
                    <ul>
                      <li>1. 본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신윤리위원회심의규정, 정보통신 윤리강령, 프로그램보호법 및 기타 관련 법령의 규정에 의합니다.</li>
                    </ul>
                    <p>제 4 조 (용어의 정의) <br>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                    <ul>
                      <li>1. 이용자 : 본 약관에 따라 기업마당 사이트가 제공하는 서비스를 받는 자.</li>
                      <li>2. 가입 : 기업마당 사이트가 제공하는 신청서 양식에 해당 정보를 기입하고, 본 약관에 동의하여 서비스 이용계약을 완료시키는 행위.</li>
                      <li>3. 회원 : 기업마당 사이트에 개인 정보를 제공하여 회원 등록을 한 자로서 기업마당 사이트가 제공하는 서비스를 이용할 수 있는 자.</li>
                      <li>4. 비밀번호 : 이용자와 회원ID가 일치하는지를 확인하고 통신상의 자신의 비밀보호를 위하여 이용자 자신이 선정한 문자와 숫자의 조합.</li>
                      <li>5. 탈퇴 : 회원이 이용계약을 종료시키는 행위.</li>
                    </ul>`,
        },
      ],
    };
  },
  methods: {
    accordionToggle(item) {
      item.isActive = !item.isActive;
    },
  },
  computed: {
    currentTitle() {
      let result = '';
      switch (this.step) {
        case 1:
          result = '약관 동의';
          break;
        case 2:
          result = '본인 인증';
          break;
        default:
          result = '개인 정보 입력';
          break;
      }
      return result;
    },
  },
};
</script>

<style scoped>

</style>